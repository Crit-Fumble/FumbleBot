import { Category } from "@discordx/utilities"
import type { CommandInteraction, Message } from "discord.js"
import { Client } from "discordx"

import { Discord, Slash } from "@decorators"
import { Guard, UserPermissions } from "@guards"

@Discord()
@Category('Admin')
export default class CloneEventCommand {

	@Slash({ 
		name: 'cloneevent'
	})
	@Guard(
		UserPermissions(['Administrator'])
	)
	async ping(
		interaction: CommandInteraction,
		client: Client,
		{ localize }: InteractionData
	) {
		const guild = interaction.guild;
		const events = guild?.scheduledEvents.fetch();

		interaction.followUp({ content: `Event Cloned -> [New Event](${''})`})
	}

}
