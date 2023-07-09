import { Category } from "@discordx/utilities"
import { ApplicationCommandOptionType, CommandInteraction, } from "discord.js"
import { Discord, Guard, Slash, SlashGroup, SlashOption } from "@decorators"
import { UserPermissions } from "@guards"
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai"

@Discord()
@Category('Admin')
@SlashGroup({ description: "Gamemaster Tools", name: "gm" })
export default class GmCommand {

	private readonly _categories: Map<string, CommandCategory[]> = new Map()

	constructor() {
    
	}

	@Slash({ 
		name: 'write',
		description: 'writes some text in response to a prompt'
	})
	@Guard(
		UserPermissions(['Administrator'])
	)
	@SlashGroup("gm")
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
			max_tokens: 300,
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

	@Slash({ 
		name: 'imagine',
		description: 'imagines an image in response to a prompt',
	})
	@SlashGroup("gm")
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