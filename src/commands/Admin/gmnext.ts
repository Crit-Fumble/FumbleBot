import { Category } from "@discordx/utilities"
import { ApplicationCommandOptionType, CommandInteraction, Message } from "discord.js"
import { Discord, Slash, SlashOption } from "@decorators"
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai"

@Discord()
@Category('General')
export default class WriteCommand {
	@Slash({ 
		name: 'gmnext'
    })
	async write(
		@SlashOption({ name: 'prompt', type: ApplicationCommandOptionType.String, required: true }) prompt: string,
		interaction: CommandInteraction, 
	) {

		const openAi = new OpenAIApi(new Configuration({
			organization: process.env.OPENAI_ORG_ID,
			apiKey: process.env.OPENAI_API_KEY,
		}));

		const rawMessages: any = await interaction.channel?.messages.fetch();
		const messages = rawMessages?.map((mes: Message) => {
			if (mes?.author?.id === process.env.BOT_APP_ID || mes?.author?.id == interaction.user.id) {
				return {
					"role": ChatCompletionRequestMessageRoleEnum.Assistant,
					// "content": `${gameSystem?.STORYTELLER_LABEL}: ${mes.content}`,
					"content": `${mes?.content}`,
				};
			} else {
				// TODO: use player character name?
				return {
					"role": ChatCompletionRequestMessageRoleEnum.User,
					"content": `${mes?.content}`,
					// "content": `<@!${mes?.author?.id}>: ${mes.content}`,
				};
			}
			// ignore all other messages
		}).reverse();

		const rawResponse: any = await openAi.createChatCompletion({
			// prompt, // TODO: get working off simple text prompt and use openAi.createCompletion
			messages,
			model: 'gpt-3.5-turbo',
			user: interaction?.user?.id,
		});
		const response = rawResponse?.data?.choices?.[0]?.message?.content;

		interaction.followUp({
			content: response,
			embeds: [{
				"title": `> ${prompt}`,
			}],
		})
	}
}