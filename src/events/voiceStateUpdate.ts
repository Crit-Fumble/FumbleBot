import { ArgsOf, Client } from "discordx"

import { Discord, On } from "@decorators"
import { GuildScheduledEventStatus } from "discord.js";

@Discord()
export default class GuildCreateEvent {

    @On('voiceStateUpdate')
    async voiceStateUpdateHandler(
        [oldState, newState]: ArgsOf<'voiceStateUpdate'>,
        client: Client
    ) {

      if (!oldState.channelId && newState.channelId) {
        // user joins voice
        
      } else if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
        // user changes channel
        
      } else if (oldState.channelId && !newState.channelId) {
        // user leaves voice
        
      }

    }
}