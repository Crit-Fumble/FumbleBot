import { Category } from "@discordx/utilities"
import { ApplicationCommandOptionType, CommandInteraction } from "discord.js"
import { Discord, Slash, SlashOption } from "@decorators"
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai"

@Discord()
@Category('General')
export default class WriteCommand {
	@Slash({ 
		name: 'write',
		description: 'writes some text in response to a prompt'
    })
	async write(
		@SlashOption({ name: 'prompt', type: ApplicationCommandOptionType.String, required: true }) prompt: string,
		interaction: CommandInteraction, 
	) {

		await interaction.deferReply();

		const openAi = new OpenAIApi(new Configuration({
			organization: process.env.OPENAI_ORG_ID,
			apiKey: process.env.OPENAI_API_KEY,
		}));
	
		// const guildMembers = await interaction.guild?.members.fetch();
		const rawResponse: any = await openAi.createChatCompletion({
			// prompt, // TODO: get working off simple text prompt and use openAi.createCompletion
			messages: [{
				// name: guildMembers?.get(interaction?.user?.id)?.displayName ?? interaction?.user?.username,
				role: ChatCompletionRequestMessageRoleEnum.User, 
				content: prompt
			}],
			model: 'gpt-3.5-turbo',
			user: interaction?.user?.id,
			max_tokens: 500,
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