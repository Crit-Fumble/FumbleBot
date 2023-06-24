import { Category } from "@discordx/utilities"
import { ApplicationCommandOptionType, CommandInteraction, Message, MessageFlags } from "discord.js"
import { Discord, Guard, Slash, SlashOption } from "@decorators"
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai"
// import * as GptCoder from 'gpt-3-encoder';

@Discord()
@Category('Premium')
export default class WriteReplyCommand {
	@Slash({ 
		name: 'writereply',
		description: 'drafts your next message for you',
	})
	async writereply(
		@SlashOption({ name: 'prompt', type: ApplicationCommandOptionType.String, required: false }) prompt: string,
		interaction: CommandInteraction, 
	) {
		await interaction.deferReply({ephemeral: true});

		const openAi = new OpenAIApi(new Configuration({
			organization: process.env.OPENAI_ORG_ID,
			apiKey: process.env.OPENAI_API_KEY,
		}));

		const guildMembers = await interaction.guild?.members.fetch();
		const rawMessages: any = await interaction.channel?.messages.fetch({limit: 32});

		// old school; shorten those messages until they are small enough
		let totalLength = 0;
		do {
			for (let i = 0; i < rawMessages.length; i++) {
				totalLength += rawMessages[i]?.content?.length ?? 0;
			}
			if (totalLength > 16000) {
				rawMessages.shift;
			}
		} while (totalLength > 16000);

		const messages = rawMessages?.filter((mes: Message) => mes?.content)?.map((mes: Message) => {
			if (mes?.author?.id == interaction.user.id) { // mes?.author?.id === process.env.BOT_APP_ID || 
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

		messages.unshift({
			"role": ChatCompletionRequestMessageRoleEnum.User,
			"content": `Assume the role of ${guildMembers?.get(interaction?.user?.id)?.displayName ?? interaction?.user?.username}, a human member of the TTRPG Community Crit Fumble Gaming's (CFG) Discord Server. ${prompt ?? 'Contribute to, comment on, or otherwise continue the above conversation.'}`,
		})
		messages.push({
			"role": ChatCompletionRequestMessageRoleEnum.User,
			"content": `${prompt ?? 'Contribute to, comment on, or otherwise continue the above conversation.'}`,
		})
		
		const rawResponse: any = await openAi.createChatCompletion({
			messages,
			model: 'gpt-3.5-turbo',
			user: interaction?.user?.id,
			max_tokens: 500,
		});
		const response = rawResponse?.data?.choices?.[0]?.message?.content;

		console.info(response);

		interaction.followUp({
			embeds: [{
				"title": `Suggested Reply`,
				"description": `\`\`\`\n${response}\n\`\`\``,
				"fields": prompt ? [{
					"name": `Prompt`,
					"value": `> ${prompt}`
				}] : undefined,
			}],
		})
	}
}