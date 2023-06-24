import { Category } from "@discordx/utilities"
import { ApplicationCommandOptionType, CommandInteraction, Message } from "discord.js"
import { Client } from "discordx"

import { Discord, Slash, SlashChoice, SlashOption } from "@decorators"
import { Guard, UserPermissions } from "@guards"


@Discord()
@Category('Admin')
export default class CloneEventCommand {

	@Slash({ 
		name: 'cloneevent',
		description: 'url: event link | weeks: weeks to add | NOTE: FumbleBot will start cloned events automatically.'
	})
	@Guard(
		UserPermissions(['Administrator'])
	)
	async ping(
		@SlashOption({ name: 'url', type: ApplicationCommandOptionType.String, required: true }) url: string,
		@SlashOption({ name: 'weeks', type: ApplicationCommandOptionType.Number, required: false }) weeks: number,
    // @SlashChoice({ name: "Weekly", value: "weekly" }, { name: "Bi-Weekly", value: "weekly" }, { name: "Monthly", value: "monthly" }, )
		// @SlashOption({ name: 'interval', type: ApplicationCommandOptionType.String, required: false }) interval: string,
		// @SlashOption({ name: 'quantity', type: ApplicationCommandOptionType.Number, required: false }) quantity: number,
		interaction: CommandInteraction,
		client: Client,
		{ localize }: InteractionData
	) {
		await interaction.deferReply({ephemeral: true});
		const eventId = url.split('/').pop();
		if (!eventId) {
			interaction.editReply({ content: `Could not find event`});
			return;
		}

		const scheduledEvents = interaction.guild?.scheduledEvents;
		const event = scheduledEvents?.cache?.get(eventId);
		if (!event?.name 
			|| !event?.scheduledStartTimestamp
		) {
			return;
		}
		
		const name = `${event?.name}`;
		let newEvent = {
			name,
			scheduledStartTime: event?.scheduledStartTimestamp ?? undefined,
			scheduledEndTime: event?.scheduledEndTimestamp ?? undefined,
			privacyLevel: event?.privacyLevel ?? undefined,
			entityType: event?.entityType ?? undefined,
			description: event?.description ?? undefined,
			channel: event?.channel ?? undefined,
			entityMetadata: event?.entityMetadata?.location ? {
				location: event?.entityMetadata?.location,
				fumbleBot: {
					test: 'TEST',
				},
			} : undefined,
			image: event?.image ?? undefined
		};

		if (weeks) {
			newEvent = {
				...newEvent,
				scheduledStartTime: newEvent?.scheduledStartTime + (weeks * 7 * 24 * 60 * 60 * 1000),
			}
		}

		do {
			// add one week until we get to a valid date
			newEvent = {
				...newEvent,
				scheduledStartTime: newEvent?.scheduledStartTime + (7 * 24 * 60 * 60 * 1000),
			}
		} while (newEvent?.scheduledStartTime <= Date.now())

		const createdEvent = await scheduledEvents?.create(newEvent);

		interaction.editReply({ content: `Event Cloned -> [${name}](${createdEvent})`})
	}

}
