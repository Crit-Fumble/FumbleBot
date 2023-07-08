import { Category } from "@discordx/utilities"
import type { CommandInteraction, Message } from "discord.js"
import { Client } from "discordx"

import { Discord, Slash } from "@decorators"
import { Guard, UserPermissions } from "@guards"

@Discord()
@Category('Admin')
export default class PingCommand {

	@Slash({ 
		name: 'ping'
	})
	@Guard(
		UserPermissions(['Administrator'])
	)
	async ping(
		interaction: CommandInteraction,
		client: Client,
		{ localize }: InteractionData
	) {
		await interaction.deferReply({ephemeral: true});
		
		const msg = (await interaction.followUp({ content: "Pinging...", fetchReply: true })) as Message

		const content = localize["COMMANDS"]["PING"]["MESSAGE"]({
			member: msg.inGuild() ? `${interaction.member},` : "",
			time: msg.createdTimestamp - interaction.createdTimestamp,
			heartbeat: client.ws.ping ? ` The heartbeat ping is ${Math.round(client.ws.ping)}ms.` : ""
		})

        await msg.edit(content)
	}

}
