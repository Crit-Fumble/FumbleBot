import { ArgsOf, Client } from "discordx"

import { Discord, Guard, On } from "@decorators"
import { Maintenance } from "@guards"
import { executeEvalFromMessage, isDev, resolveDependencies, resolveDependency } from "@utils/functions"

import { generalConfig } from "@configs"
import { Database, FumbleBot } from "@services"
import { Channel, ChannelRepository } from "@entities"

@Discord()
export default class MessageCreateEvent {
    private db: Database
    private channelRepo: ChannelRepository

	constructor() {
        resolveDependencies([Database]).then(([db]) => {
            this.db = db
            this.channelRepo = this.db.get(Channel);
        })
    }

    @On("messageCreate")
    @Guard(
        Maintenance
    )
    async messageCreateHandler(
        [message]: ArgsOf<"messageCreate">, 
        client: Client
     ) {

        // eval command
        if (
            message.content.startsWith(`\`\`\`${generalConfig.eval.name}`)
            && (
                (!generalConfig.eval.onlyOwner && isDev(message.author.id))
                || (generalConfig.eval.onlyOwner && message.author.id === generalConfig.ownerId)
            )
        ) {
            executeEvalFromMessage(message)
        }

        await client.executeCommand(message, false)

		const channelData = await this.channelRepo.findOne({channelId: message.channelId});
        if (channelData?.botChat) {
            switch(channelData?.mode) {
                case 'chat' :
                    const fb = await resolveDependency(FumbleBot);
                    await fb.chat({
                        message,
                        channelData
                    })
                    break;
                default:
            }
        }

    }
}