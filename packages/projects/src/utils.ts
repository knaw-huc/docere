import type { Entity } from '@docere/common'

export class EntityController {
	private _entities: Map<string, Entity> = new Map()

	get entities() {
		return Array.from(this._entities.values())
	}

	add(entity: Entity) {
		if (this._entities.has(entity.id)) {
			const e = this._entities.get(entity.id)
			e.count += 1
			this._entities.set(e.id, e)
		}
		else {
			this._entities.set(
				entity.id,
				{
					count: 1,
					id: entity.id,
					type: entity.type,
					value: entity.value
				}
			)
		}

	}
}
