import { Entity, EntityRepositoryType, PrimaryKey, Property } from "@mikro-orm/core"
import { EntityRepository } from "@mikro-orm/sqlite"

import { CustomBaseEntity } from '@entities'

// ===========================================
// ================= Entity ==================
// ===========================================

@Entity({ customRepository: () => PlayerRepository })
export class Player extends CustomBaseEntity {

    [EntityRepositoryType]?: PlayerRepository

    @PrimaryKey({ autoincrement: false })
    id!: string

    @Property()
    threadId!: string // For identification

    @Property()
    messageId!: string // For identification

    @Property()
    channelId!: string // For identification

    @Property()
    mode!: string // "RP" by default, also "Combat", "Travel", "Downtime", or more later

    @Property()
    lastInteract: Date = new Date()

    @Property()
    data?: string // TODO: Postgres for jsonb fields
}

// ===========================================
// =========== Custom Repository =============
// ===========================================

export class PlayerRepository extends EntityRepository<Player> { 

    async updateLastInteract(userId?: string): Promise<void> {

        const user = await this.findOne({ id: userId })

        if (user) {
            user.lastInteract = new Date()
            await this.flush()
        }
    }
}