import { GuildScheduledEventStatus } from "discord.js";

export function isToday(d1: Date) {
  const d2 = new Date();
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

export function eventCheck(state: any) {
  const scheduledEvents = state.guild?.scheduledEvents;
  const eventCache = scheduledEvents.cache;
  const filteredEvents = eventCache.filter((ev: any) => {
    return ev.channelId == state.channelId;
  }).filter((ev: any) => {
    if ( ev.creatorId !== process.env.BOT_APP_ID
      || !ev?.scheduledStartTimestamp 
      || ev.status !== GuildScheduledEventStatus.Scheduled
      || !isToday(new Date(ev?.scheduledStartTimestamp))
    ) {
      return false;
    }
    // if event is more than 1 minute in the future, wait
    if (ev?.scheduledStartTimestamp ? ev?.scheduledStartTimestamp > (Date.now() + (1 * 60 * 1000)) : false) {
      return false;
    };

    // start event
    return true;
  });
  filteredEvents.first()?.setStatus(GuildScheduledEventStatus.Active);
  console.log(filteredEvents);
}