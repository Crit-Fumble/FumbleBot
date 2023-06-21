import { Category } from "@discordx/utilities"
import { ApplicationCommandOptionType, CommandInteraction, Message, MessageFlags } from "discord.js"
import { Discord, Guard, Slash, SlashOption } from "@decorators"
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai"
import { UserPermissions } from "@guards";

@Discord()
@Category('Admin')
export default class GmNextCommand {
	@Slash({ 
		name: 'gmnext'
	})
	@Guard(
		UserPermissions(['Administrator'])
	)
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
			messages,
			model: 'gpt-3.5-turbo',
			user: interaction?.user?.id,
			stop: '\n'
		});
		const response = rawResponse?.data?.choices?.[0]?.message?.content;

		// TODO: generate an image as well

		interaction.followUp({
			content: response,
			embeds: [{
				"title": `> ${prompt}`,
			}],
			flags: MessageFlags.Ephemeral,
		})
	}
}