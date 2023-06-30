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
		await interaction.deferReply({ephemeral: true});
		const now = Math.floor(Date.now() / 1000);
		let parseDate = (dateString ? (Date.parse(dateString).valueOf() / 1000) : now);
		console.log(parseDate)
		if (Number.isNaN(parseDate)) {
			return interaction.editReply({
				content: `\`${dateString}\` is not a valid date/time. See [Date.parse() JavaScript Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse)`,
			})
			// parseDate = (((new Date(`${now.getFullYear} ${now.getFullYear} ${dateString}`))) ) 
			// if (Number.isNaN(parseDate)) {
			// return `\`${dateString}\` is not a valid date/time`
			// }
		}
		// console.log(parseDate)
		const tsTag = `<t:${parseDate}>`;
		interaction.editReply({
			content: `${dateString ?? 'Today'} -> \`${tsTag}\` -> ${tsTag}`,
		})
	}
}