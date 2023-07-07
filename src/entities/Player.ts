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
    lastInteract: Date = new Date()

    @Property()
    userId?: string // For identification

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