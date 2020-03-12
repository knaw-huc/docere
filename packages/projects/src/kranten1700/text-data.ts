export default function extractTextData(doc: XMLDocument, _config: DocereConfig) {
	const entities: Map<string, Entity> = new Map()

	for(const el of doc.querySelectorAll('w')) {
		const id = el.getAttribute('pos')

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
					type: 'pos',
					value: id,
				}
			)
		}
	}

	for(const el of doc.querySelectorAll('w[type]')) {
		const type = el.getAttribute('type')
		const id = el.getAttribute('value')

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
					value: id,
				}
			)
		}
	}

	return Array.from(entities.values())
}
