import type { DocereConfig, Entity } from '@docere/common'

export default function extractTextData(doc: XMLDocument, _config: DocereConfig): Entity[] {
	const selector = 'ner'
	const entities: Map<string, Entity> = new Map()

	Array.from(doc.querySelectorAll(selector))
		.forEach(currEl => {
			currEl.getAttribute('type')
				.split(' ')
				.forEach(type => {
					const id = currEl.textContent

					if (entities.has(id)) {
						const entity = entities.get(id)
						entity.props.count += 1
						entities.set(id, entity)
					}
					else {
						entities.set(
							id, 
							{
								count: 0,
								id,
								type,
								value: id,
							}
						)
					}
				})
		})

	return Array.from(entities.values())
}
