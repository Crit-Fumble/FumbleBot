import { Category } from "@discordx/utilities"
import { ApplicationCommandOptionType, CommandInteraction, Message, MessageFlags } from "discord.js"
import { Discord, Guard, Slash, SlashOption } from "@decorators"
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai"
import { UserPermissions } from "@guards";

@Discord()
@Category('Admin')
export default class ChatCommand {
	@Slash({ 
		name: 'chat',
		description: 'prompts the bot to say something',
	})
	@Guard(
		UserPermissions(['Administrator'])
	)
	async chat(
		@SlashOption({ name: 'prompt', type: ApplicationCommandOptionType.String, required: false }) prompt: string,
		interaction: CommandInteraction, 
	) {
		await interaction.deferReply({ephemeral: true});
		const openAi = new OpenAIApi(new Configuration({
			organization: process.env.OPENAI_ORG_ID,
			apiKey: process.env.OPENAI_API_KEY,
		}));

		// const guildMembers = await interaction.guild?.members.fetch();
		const rawMessages: any = await interaction.channel?.messages.fetch({limit: 64});
		const messages = rawMessages?.filter((mes: Message) => mes?.content)?.map((mes: Message) => {
			if (mes?.author?.id === process.env.BOT_APP_ID) {
				return {
					"role": ChatCompletionRequestMessageRoleEnum.Assistant,
					"content": `${mes?.content}`,
				};
			} else {
				return {
					// "name": guildMembers?.get(mes?.author?.id)?.displayName ?? mes?.author?.username,
					"role": ChatCompletionRequestMessageRoleEnum.User,
					"content": `${mes?.content}`,
				};
			}
		}).reverse() ?? [];

		// TODO: limit the number of total tokens
		
		messages.unshift({
			"role": ChatCompletionRequestMessageRoleEnum.User,
			"content": `Assume the role of FumbleBot, a chat bot on the TTRPG Community Crit Fumble Gaming's (CFG) Discord Server. ${prompt ?? 'Contribute to, comment on, or otherwise continue the above conversation.'}`,
		}),
		messages.push({
			"role": ChatCompletionRequestMessageRoleEnum.User,
			"content": `${prompt ?? 'Contribute to, comment on, or otherwise continue the above conversation.'}`,
		})

		console.log(messages);
		
		const rawResponse: any = await openAi.createChatCompletion({
			messages,
			model: 'gpt-3.5-turbo',
			user: interaction?.user?.id,
			max_tokens: 500,
		});
		const response = rawResponse?.data?.choices?.[0]?.message?.content;

		await interaction.editReply(`Chat Response Executed${prompt ? ` /w prompt\n>>>${prompt}` : '.'}`);

		interaction.channel?.send({
			content: response,
			embeds: prompt ? [{
				"title": `Prompt`,
				"description": `> ${prompt}`,
			}] : undefined,
		})
	}
}