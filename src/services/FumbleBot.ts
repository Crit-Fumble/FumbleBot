import dayjs from "dayjs"
import { singleton } from "tsyringe"
import { Schedule } from "@decorators"
import { Channel, ChannelRepository } from "@entities"
import { Database } from "@services"
import { resolveDependencies, resolveDependency, isToday } from "@utils/functions"
import { Client} from "discordx"
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai"
import { ChannelType, GuildScheduledEventStatus, Message } from "discord.js"

const TEN_SECS = 10 * 1000;
async function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

@singleton()
export class FumbleBot {
    private activeChannels: Map<string, Promise<any> | null> = new Map();

    public async chat({
        message, channelData
    }: {
        message: Message // ChannelType.DMChannel | ChannelType.PartialDMChannel | ChannelType.NewsChannel | ChannelType.StageChannel | ChannelType.TextChannel | ChannelType.PrivateThreadChannel | ChannelType.PublicThreadChannel<...> | ChannelType.VoiceChannel
        channelData: Channel
    }) {

        // TODO: throttle this; if the other user sends a message before a reply is sent, restart
        const openAi = new OpenAIApi(new Configuration({
			organization: process.env.OPENAI_ORG_ID,
			apiKey: process.env.OPENAI_API_KEY,
		}));
		try {
            const channel = message?.channel;
            const pendingRequest = this.activeChannels?.get(channel?.id)
            if (pendingRequest) {
                Promise.reject(pendingRequest);
            }
			const rawMessagesPromise: any = channel?.messages.fetch({limit: 32})
            this.activeChannels.set(channel?.id, rawMessagesPromise);
            const rawMessages = await rawMessagesPromise;
            await wait(TEN_SECS);
            channel.sendTyping();
			
			let totalLength = 0;
			do {
				for (let i = 0; i < rawMessages.length; i++) {
					totalLength += rawMessages[i]?.content?.length ?? 0;
				}
				if (totalLength > 10000) {
					rawMessages.shift;
				}
			} while (totalLength > 10000);

			const messages = rawMessages?.filter((mes: Message) => mes?.content)?.map((mes: Message) => {
				if (mes?.author?.id === process.env.BOT_APP_ID) {
					return {
						"role": ChatCompletionRequestMessageRoleEnum.Assistant,
						"content": `${mes?.content}`,
					};
				} else {
					return {
						"role": ChatCompletionRequestMessageRoleEnum.User,
						"content": `${mes?.content}`,
					};
				}
			}).reverse() ?? [];

			// IDEA: selectively increase context size?
			// TODO: limit the number of total tokens more precisely
			
            // add prompt
            messages.unshift({
                "role": ChatCompletionRequestMessageRoleEnum.User,
                "content": `Assume the role of FumbleBot, a chat bot on the TTRPG Community Crit Fumble Gaming's (CFG) Discord Server. ${channelData?.prompt ?? 'Contribute to, comment on, or otherwise continue the above conversation.'}`,
            });
			
			const rawResponsePromise: any = openAi.createChatCompletion({
				messages,
				model: 'gpt-3.5-turbo',
				max_tokens: 250,
			});
            this.activeChannels.set(channel?.id, rawResponsePromise);
            const rawResponse = await rawResponsePromise;
			const response = rawResponse?.data?.choices?.[0]?.message?.content;
            if (!response) {
                throw "No Response from OpenAI";
            }
            const replyPromise = channel?.send(response);
            this.activeChannels.set(channel?.id, replyPromise);
            const reply = await replyPromise;
            this.activeChannels.delete(channel?.id);

            return reply;
        } catch (err) {
            console.error(err);
            return "Something went wrong...";
        }
    }

    // every minute
    @Schedule('* * * * *')
    private async minute(): Promise<void> {
        const client = await resolveDependency(Client)
        const guilds = client.guilds.cache;

        // for each guild
        await Promise.all(guilds.map(guild => {
            // start scheduled events
            const scheduledEvents = guild?.scheduledEvents;
            const eventCache = scheduledEvents.cache;
            const ONE_MINUTE = (1 * 60 * 1000);
            eventCache?.each(ev => {
                if ( ev.creatorId !== process.env.BOT_APP_ID
                || ev.status !== GuildScheduledEventStatus.Scheduled
                || !ev?.scheduledStartTimestamp 
                || !isToday(new Date(ev?.scheduledStartTimestamp))
                || ev?.scheduledStartTimestamp > (Date.now() + ONE_MINUTE)
                ) {
                    return;
                }
                ev?.setStatus(GuildScheduledEventStatus.Active);
            });
        }))
    }
}