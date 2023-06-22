import { Category } from "@discordx/utilities"
import { ApplicationCommandOptionType, CommandInteraction, } from "discord.js"
import { Discord, Guard, Slash, SlashOption } from "@decorators"
import { UserPermissions } from "@guards"
import { Configuration, OpenAIApi } from "openai"

@Discord()
@Category('Admin')
export default class ImagineCommand {

	private readonly _categories: Map<string, CommandCategory[]> = new Map()

	constructor() {
    
	}

	@Slash({ 
		name: 'imagine',
		description: 'imagines an image in response to a prompt',
	})
	@Guard(
		UserPermissions(['Administrator'])
	)
	async imagine(
		@SlashOption({ name: 'prompt', type: ApplicationCommandOptionType.String, required: true }) prompt: string,
		interaction: CommandInteraction, 
	) {
		await interaction.deferReply();
		// NOTE: low-res (256x256) only on free tier
		// TODO: 512x512 and 1024x1024 for premium roles
		const openAi = new OpenAIApi(new Configuration({
			organization: process.env.OPENAI_ORG_ID,
			apiKey: process.env.OPENAI_API_KEY,
		}));
	
		const rawResponse: any = await openAi.createImage({
			prompt,
			n: 1,
			size: '256x256',
			response_format: 'url',
			user: interaction?.user?.id
		});
		const response = rawResponse?.data?.data?.[0];

		if (!response?.url) {
			return;
		}

		interaction.followUp({
			content: response?.url,
			embeds: [{
				"title": `> ${prompt}`,
				"image": {
					"url": `${response?.url}`,
				},
			}],
		})
	}
}