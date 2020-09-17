import type { DocereConfig, Entity } from '@docere/common'

export default function extractTextData(doc: XMLDocument, _config: DocereConfig) {
	const selector = 'entity'
	const entities: Map<string, Entity> = new Map()

	for(const el of doc.querySelectorAll(selector)) {
		el.getAttribute('type')
			.split(' ')
			.forEach(type => {
				const id = el.id

				if (entities.has(id)) {
					const entity = entities.get(id)
					entity.count += 1
					entities.set(id, entity)
				}
				else {
					entities.set(
						id,
						{
							count: 1,
							id,
							type,
							value: el.getAttribute('content'),
						}
					)
				}
			})
	}

	return Array.from(entities.values())
}
