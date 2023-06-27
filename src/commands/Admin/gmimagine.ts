import { Category } from "@discordx/utilities"
import { ApplicationCommandOptionType, CommandInteraction, } from "discord.js"
import { Discord, Guard, Slash, SlashOption } from "@decorators"
import { UserPermissions } from "@guards"
import { Configuration, OpenAIApi } from "openai"

@Discord()
@Category('Admin')
export default class GmImagineCommand {

	private readonly _categories: Map<string, CommandCategory[]> = new Map()

	constructor() {
    
	}

	@Slash({ 
		name: 'gmimagine',
		description: 'imagines an image in response to a prompt',
	})
	@Guard(
		UserPermissions(['Administrator'])
	)
	async imagine(
		@SlashOption({ name: 'prompt', type: ApplicationCommandOptionType.String, required: true }) prompt: string,
		@SlashOption({ name: 'data', type: ApplicationCommandOptionType.Attachment , required: false }) file: any,
		interaction: CommandInteraction, 
	) {
		await interaction.deferReply({ephemeral: true});

		const openAi = new OpenAIApi(new Configuration({
			organization: process.env.OPENAI_ORG_ID,
			apiKey: process.env.OPENAI_API_KEY,
		}));
	
		const rawResponse: any = await openAi.createImage({
			prompt,
			n: 1,
			size: '1024x1024',
			response_format: 'url',
			user: interaction?.user?.id
		});
		const response = rawResponse?.data?.data?.[0];

		if (!response?.url) {
			return;
		}

		interaction.followUp({
			content: `[Link to Image](${response?.url})`,
			embeds: [{
				"image": {
					"url": `${response?.url}`,
				},
				"fields": prompt ? [{
					"name": `Prompt`,
					"value": `> ${prompt}`
				}] : undefined,
			}],
		})
	}
}