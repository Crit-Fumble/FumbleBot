import { Entity, EntityRepositoryType, Index, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core"
import { EntityRepository } from "@mikro-orm/sqlite"

import { CustomBaseEntity } from '@entities'

// ===========================================
// ================= Entity ==================
// ===========================================

@Entity({ customRepository: () => ThreadRepository })
export class Thread extends CustomBaseEntity {

    [EntityRepositoryType]?: ThreadRepository

    @PrimaryKey({ autoincrement: false })
    threadId!: string // For identification, the id of the thread itself... if empty, this is a top-level channel game

    @PrimaryKey({ autoincrement: false })
    messageId!: string // For identification, parent message of the thread... if empty, this is a top-level channel game

    @PrimaryKey({ autoincrement: false })
    channelId!: string // For identification, parent channel of the thread

    @Property()
    lastInteract: Date = new Date()

    @Property({ default: false })
    botChat?: boolean = false // true if bot should chat, false if not

    @Property({ default: "chat" })
    mode?: string = "chat" // "Chat" by default, also "RP", "Combat", "Travel", "Downtime", or more later

    @Property({ nullable: true })
    prompt?: string // this can be set by the aDMin initiating the chat

    @Property({ type: 'json', nullable: true })
    data?: any
}

// ===========================================
// =========== Custom Repository =============
// ===========================================

export class ThreadRepository extends EntityRepository<Thread> { 

    async updateLastInteract(threadId?: string, messageId?: string, channelId?: string): Promise<void> {

        const thread = await this.findOne({ threadId, messageId, channelId })

        if (thread) {
            thread.lastInteract = new Date()
            await this.flush()
        }
    }
}