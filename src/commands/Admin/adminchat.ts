import { Category } from "@discordx/utilities"
import { ApplicationCommandOptionType, CommandInteraction, Message, MessageFlags } from "discord.js"
import { Discord, Guard, Slash, SlashOption, SlashGroup } from "@decorators"
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai"
import { UserPermissions } from "@guards";
import { Database } from "@services";
import { Channel } from "@entities";
import { resolveDependencies } from "@utils/functions";
// import * as GptCoder from 'gpt-3-encoder';

@Discord()
@SlashGroup({ description: "Admin FumbleBot Chat", name: "adminchat" })
export default class AdminChatCommand {
    private db: Database

	constructor() {
        resolveDependencies([Database]).then(([db]) => {
            this.db = db
        })
    }

	// BELOW: Admin Only / Guarded commands
	@Slash({ 
		name: 'start',
		description: 'Starts FumbleBot chat in this channel, with an optional prompt.'
	})
	@Guard(
		UserPermissions(['Administrator'])
	)
	@Category('Admin')
	@SlashGroup("adminchat")
	async start(
		@SlashOption({ name: 'prompt', type: ApplicationCommandOptionType.String, required: false }) prompt: string,
		interaction: CommandInteraction, 
	) {
		await interaction.deferReply({ephemeral: true});
		if (interaction.channel?.isThread()) {
			return await interaction.editReply({
				content: `FumbleBot Chat cannot run in a thread (yet)...`,
			})
		}

		const channelRepo = this.db.get(Channel);
		const channelData = await channelRepo.findOne({channelId: interaction.channelId});
		console.log(channelData)
		if (!channelData) {
			await channelRepo.create({ 
				channelId: interaction.channelId,
				createdAt: new Date(),
				updatedAt: new Date(),
				lastInteract: new Date(),
				botChat: true,
				prompt,
			});
		} else {
			await channelRepo.upsert({ 
				channelId: interaction.channelId,
				botChat: true,
				prompt,
			});
		}
		
		channelRepo.flush()

		await interaction.editReply({
			content: `FumbleBot Chat Started`,
		})
	}

	@Slash({ 
		name: 'stop',
		description: 'stops FumbleBot Chat in this channel.'
	})
	@Guard(
		UserPermissions(['Administrator'])
	)
	@Category('Admin')
	@SlashGroup("adminchat")
	async stop(
		interaction: CommandInteraction, 
	) {
		await interaction.deferReply({ephemeral: true});
		if (interaction.channel?.isThread()) {
			return await interaction.editReply({
				content: `FumbleBot Chat cannot run in a thread (yet)...`,
			})
		}

		const channelRepo = this.db.get(Channel);
		const channelData = await channelRepo.findOne({channelId: interaction.channelId});
		console.log(channelData)
		if (!channelData) {
			await channelRepo.create({ 
				channelId: interaction.channelId,
				createdAt: new Date(),
				updatedAt: new Date(),
				lastInteract: new Date(),
			});
		} else {
			await channelRepo.upsert({ 
				channelId: interaction.channelId,
				botChat: false,
			});
		}

		await interaction.editReply({
			content: `FumbleBot Chat Ended`,
		})
	}
}