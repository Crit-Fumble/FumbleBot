import { ActivityType, GuildScheduledEventStatus } from "discord.js"
import { Client } from "discordx"
import { injectable } from "tsyringe"

import { generalConfig, logsConfig } from "@configs"
import { Discord, Once, Schedule } from "@decorators"
import { Data } from "@entities"
import { Database, Logger, Scheduler, Store } from "@services"
import { resolveDependency, syncAllGuilds, isToday } from "@utils/functions"


@Discord()
@injectable()
export default class ReadyEvent {

    constructor(
        private db: Database,
        private logger: Logger,
        private scheduler: Scheduler,
        private store: Store
    ) {}

    private activityIndex = 0

    @Once('ready')
    async readyHandler([client]: [Client]) {
        // make sure all guilds are cached
        await client.guilds.fetch()

        // synchronize applications commands with Discord
        await client.initApplicationCommands({
            global: {
                disable: {
                    delete: false
                }
            }
        })

        // change activity
        await this.changeActivity();

        // update last startup time in the database
        await this.db.get(Data).set('lastStartup', Date.now())

        // start scheduled jobs
        this.scheduler.startAllJobs()

        // log startup
        await this.logger.logStartingConsole()

        // synchronize guilds between discord and the database
        await syncAllGuilds(client)

        // the bot is fully ready
        this.store.update('ready', (e) => ({ ...e, bot: true }))
    }

    @Schedule('*/15 * * * * *') // each 15 seconds
    async changeActivity() {
        // set bot activity
        const ActivityTypeEnumString = ["PLAYING", "STREAMING", "LISTENING", "WATCHING", "CUSTOM", "COMPETING"] // DO NOT CHANGE THE ORDER
        const client = await resolveDependency(Client)
        const activity = generalConfig.activities[this.activityIndex]
        activity.text = eval(`new String(\`${activity.text}\`).toString()`)
        client.user?.setActivity(activity.text, {
            type: ActivityTypeEnumString.indexOf(activity.type)
        })
        this.activityIndex++
        if (this.activityIndex === generalConfig.activities.length) this.activityIndex = 0
    }

    @Schedule('0 */1 * * * *') // each 1 minute
    async minuteUpdate() {
        const client = await resolveDependency(Client)
        const guilds = client.guilds.cache;

        // for each guild
        await Promise.all(guilds.map(guild => {
            // start scheduled events
            const scheduledEvents = guild?.scheduledEvents;
            const eventCache = scheduledEvents.cache;
            const ONE_MINUTE = (1 * 60 * 1000);
            eventCache?.each(ev => {
                if ( ev.creatorId !== process.env.BOT_APP_ID
                || ev.status !== GuildScheduledEventStatus.Scheduled
                || !ev?.scheduledStartTimestamp 
                || !isToday(new Date(ev?.scheduledStartTimestamp))
                || ev?.scheduledStartTimestamp > (Date.now() + ONE_MINUTE)
                ) {
                    return;
                }
                ev?.setStatus(GuildScheduledEventStatus.Active);
            });
        }))
    }

    @Schedule('0 */10 * * * *') // each 10 minutes
    async tenMinuteUpdate() {
        //
    }

    @Schedule('0 0 */1 * * *') // each 1 hour
    async hourUpdate() {
        //
    }
}