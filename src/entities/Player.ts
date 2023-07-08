import { Entity, EntityRepositoryType, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core"
import { EntityRepository } from "@mikro-orm/sqlite"

import { CustomBaseEntity } from '@entities'

// ===========================================
// ================= Entity ==================
// ===========================================

@Entity({ customRepository: () => PlayerRepository })
export class Player extends CustomBaseEntity {

    [EntityRepositoryType]?: PlayerRepository

    @PrimaryKey({ autoincrement: false })
    userId?: string // For identification

    @Property()
    lastInteract: Date = new Date()

    @Property({ type: 'json', nullable: true })
    data?: any
}

// ===========================================
// =========== Custom Repository =============
// ===========================================

export class PlayerRepository extends EntityRepository<Player> { 

    async updateLastInteract(userId?: string): Promise<void> {

        const player = await this.findOne({ userId })

        if (player) {
            player.lastInteract = new Date()
            await this.flush()
        }
    }
}