import type { DocereConfig, Entity } from '@docere/common'

function extractPageLinks(type: string, selector: string, entities: Map<string, Entity>, doc: XMLDocument) {
	Array.from(doc.querySelectorAll(selector))
		.forEach(currEl => {
			const id = currEl.getAttribute('target').split('#')[1]

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
						value: currEl.textContent,
					}
				)
			}
		})


}

export default function extractEntities(doc: XMLDocument, _config: DocereConfig) {
	// const selector = 'div[type="translation"] rs[type="pers"]'
	const entities: Map<string, Entity> = new Map()

	extractPageLinks('biblio', 'ref[target^="biblio.xml#"]', entities, doc)
	extractPageLinks('bio', 'ref[target^="bio.xml#"]', entities, doc)


	Array.from(doc.querySelectorAll('rs[type="artwork-m"]'))
		.forEach(currEl => {
			const id = currEl.getAttribute('key')

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
						type: 'rkd-artwork-link',
						value: currEl.textContent,
					}
				)
			}
		})


	return Array.from(entities.values())
}
