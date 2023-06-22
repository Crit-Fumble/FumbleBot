import { Category } from "@discordx/utilities"
import { ApplicationCommandOptionType, CommandInteraction } from "discord.js"
import { Discord, Guard, Slash, SlashOption } from "@decorators"
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai"
import { UserPermissions } from "@guards";

@Discord()
@Category('Admin')
export default class GmWriteCommand {
	@Slash({ 
		name: 'gmwrite',
		description: 'writes some text in response to a prompt'
	})
	@Guard(
		UserPermissions(['Administrator'])
	)
	async write(
		@SlashOption({ name: 'prompt', type: ApplicationCommandOptionType.String, required: true }) prompt: string,
		interaction: CommandInteraction, 
	) {

		await interaction.deferReply({ephemeral: true});

		const openAi = new OpenAIApi(new Configuration({
			organization: process.env.OPENAI_ORG_ID,
			apiKey: process.env.OPENAI_API_KEY,
		}));
	
		const messages = [{
				// name: guildMembers?.get(interaction?.user?.id)?.displayName ?? interaction?.user?.username,
				role: ChatCompletionRequestMessageRoleEnum.User, 
				content: prompt
			}
		]

		// const guildMembers = await interaction.guild?.members.fetch();
		const rawResponse: any = await openAi.createChatCompletion({
			// prompt, // TODO: get working off simple text prompt and use openAi.createCompletion
			messages,
			model: 'gpt-3.5-turbo',
			user: interaction?.user?.id,
			max_tokens: 500,
		});
		const response = rawResponse?.data?.choices?.[0]?.message?.content;

		interaction.followUp({
			content: response,
			embeds: [{
				"fields": prompt ? [{
					"name": `Prompt`,
					"value": `> ${prompt}`
				}] : undefined,
			}],
		})
	}
}