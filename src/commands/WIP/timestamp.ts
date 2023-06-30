import { Category } from "@discordx/utilities"
import { ApplicationCommandOptionType, CommandInteraction, Message, MessageFlags } from "discord.js"
import { Discord, Slash, SlashOption } from "@decorators"

@Discord()
@Category('WIP')
export default class timestamp {
	@Slash({ 
		name: 'timestamp',
		description: 'parses a date and returns a timestamp | date: the date to be parsed ', // | zone: your local timezone ',
	})
	async timestamp(
		@SlashOption({ name: 'date', type: ApplicationCommandOptionType.String, required: false }) dateString: string,
		// @SlashOption({ name: 'zone', type: ApplicationCommandOptionType.String, required: false }) timezoneString: string,
		interaction: CommandInteraction, 
	) {
		const now = new Date()
		console.log(now.getUTCDate())
		let parseDate = (dateString ? ((new Date(dateString))?.getUTCDate()) : now.getUTCDate()) ;
		console.log(parseDate)
		if (Number.isNaN(parseDate)) {
			parseDate = (((new Date(`${now.getFullYear} ${now.getFullYear} ${dateString}`))?.getUTCDate()) ) 
			if (Number.isNaN(parseDate)) {
				return `\`&{dateString}\` is not a valid date/time`
			}
		}
		// console.log(parseDate)
		await interaction.deferReply({ephemeral: true});
		const tsTag = `<t:${parseDate}}>`;
		interaction.editReply({
			content: `${dateString ?? 'Today'} -> \`${tsTag}\` -> ${tsTag}`,
		})
	}
}