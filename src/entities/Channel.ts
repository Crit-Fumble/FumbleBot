import { Entity, EntityRepositoryType, Index, OptionalProps, PrimaryKey, Property, Unique } from "@mikro-orm/core"
import { EntityRepository } from "@mikro-orm/sqlite"

import { CustomBaseEntity } from '@entities'

// ===========================================
// ================= Entity ==================
// ===========================================

@Entity({ customRepository: () => ChannelRepository })
export class Channel extends CustomBaseEntity {

    [EntityRepositoryType]?: ChannelRepository
    
    @PrimaryKey({ autoincrement: false })
    channelId!: string

    @Property()
    lastInteract: Date = new Date()

    @Property({ default: false })
    botChat?: boolean = false // true if bot should chat, false if not

    @Property({ default: "chat" })
    mode?: string = "chat" // chat by default, could also be gameplay, GM notes, etc

    @Property({ nullable: true })
    prompt?: string // this can be set by the aDMin initiating the chat

    @Property({ type: 'json', nullable: true })
    data?: any
}

// ===========================================
// =========== Custom Repository =============
// ===========================================
export class ChannelRepository extends EntityRepository<Channel> { 

    async updateLastInteract(channelId?: string): Promise<void> {

        const channel = await this.findOne({ channelId })

        if (channel) {
            channel.lastInteract = new Date()
            await this.flush()
        }
    }
}