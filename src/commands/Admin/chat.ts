import { Category } from "@discordx/utilities"
import { ApplicationCommandOptionType, CommandInteraction, Message, MessageFlags } from "discord.js"
import { Discord, Guard, Slash, SlashOption } from "@decorators"
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai"
import { UserPermissions } from "@guards";

@Discord()
@Category('Admin')
export default class ChatCommand {
	@Slash({ 
		name: 'chat',
		description: 'prompts the bot to say something',
	})
	@Guard(
		UserPermissions(['Administrator'])
	)
	async write(
		interaction: CommandInteraction, 
	) {
		await interaction.deferReply({ephemeral: true});
		const openAi = new OpenAIApi(new Configuration({
			organization: process.env.OPENAI_ORG_ID,
			apiKey: process.env.OPENAI_API_KEY,
		}));

		// const guildMembers = await interaction.guild?.members.fetch();
		const rawMessages: any = await interaction.channel?.messages.fetch();
		const messages = rawMessages?.map((mes: Message) => {
			if (mes?.author?.id === process.env.BOT_APP_ID) {
				return {
					"role": ChatCompletionRequestMessageRoleEnum.Assistant,
					"content": `${mes?.content}`,
				};
			} else {
				return {
					// "name": guildMembers?.get(mes?.author?.id)?.displayName ?? mes?.author?.username,
					"role": ChatCompletionRequestMessageRoleEnum.User,
					"content": `${mes?.content}`,
				};
			}
		}).reverse();

		const rawResponse: any = await openAi.createChatCompletion({
			messages,
			model: 'gpt-3.5-turbo',
			user: interaction?.user?.id,
		});
		const response = rawResponse?.data?.choices?.[0]?.message?.content;

		await interaction.editReply('');
		
		interaction.channel?.send({
			content: response,
		})
	}
}