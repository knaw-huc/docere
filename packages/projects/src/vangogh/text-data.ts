
export default function extractTextData(doc: XMLDocument, _config: DocereConfig) {
	const selector = 'div[type="translation"] rs[type="pers"]'
	const entities: Map<string, Entity> = new Map()

	Array.from(doc.querySelectorAll(selector))
		.forEach(currEl => {
			currEl.getAttribute('type')
				.split(' ')
				.forEach(type => {
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
								type,
								value: currEl.textContent,
							}
						)
					}
				})
		})

	return Array.from(entities.values())
}

	// textData: [
	// 	{
	// 		color: '#fd7a7a',
	// 		id: 'person',
	// 		aside: true,
	// 		extractor: {
	// 			selector: 'div[type="translation"] rs[type="pers"]',
	// 			extractionType: TextDataExtractionType.Attribute,
	// 			idAttribute: '_key'
	// 		},
	// 		textLayers: ['translation'],
	// 	}
	// ],
