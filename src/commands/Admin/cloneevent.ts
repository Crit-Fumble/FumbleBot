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
		// @SlashOption({ name: 'months', type: ApplicationCommandOptionType.Number, required: false }) months: number,
		// @SlashOption({ name: 'number', type: ApplicationCommandOptionType.Number, required: false }) number: number,
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

		interaction.editReply({ content: `Found Event\n\`\`\`${JSON.stringify(event, null, 2)}\`\`\``});
		
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

		// if (months) {
		// 	// TODO: on the xth weekday of the month, ie 3rd thursday, etc
		// 	newEvent = {
		// 		...newEvent,
		// 		scheduledStartTime: newEvent?.scheduledStartTime + (weeks * 7 * 24 * 60 * 60 * 1000),
		// 	}
		// }

		do {
			// add one week until we get to a valid date
			newEvent = {
				...newEvent,
				scheduledStartTime: newEvent?.scheduledStartTime + (7 * 24 * 60 * 60 * 1000),
			}
		} while (newEvent?.scheduledStartTime <= Date.now())

		// TODO: create number, iterating the time interval each time
		interaction.editReply({ content: `New Event Data\n\`\`\`${JSON.stringify(newEvent, null, 2)}\`\`\``});

		const createdEvent = await scheduledEvents?.create(newEvent).catch(err => {
			return interaction.editReply({ content: `Error Creating Event\n\`\`\`${JSON.stringify(err, null, 2)}\`\`\``});
		});

		return interaction.editReply({ content: `Created Event -> [${name}](${createdEvent})\n\`\`\`${JSON.stringify(createdEvent, null, 2)}\`\`\``});
	}
}
