import { EntityController } from '../utils'
import type { DocereConfig } from '@docere/common'

export default function extractTextData(doc: XMLDocument, _config: DocereConfig) {
	const entityController = new EntityController()

	// Persons
	Array.from(doc.querySelectorAll('div[type="translation"] rs[type="pers"]'))
		.forEach(currEl => {
			currEl.getAttribute('type')
				.split(' ')
				.forEach(type => {
					const id = currEl.getAttribute('key')
						
					entityController.add({
						id,
						type,
						value: currEl.textContent
					})
				})
		})

	// Links to entries and notes
	Array.from(doc.querySelectorAll('ref[target]'))
		.forEach(currEl => {
			entityController.add({
				id: currEl.getAttribute('target'),
				type: currEl.getAttribute('target').indexOf('#') > -1 ? 'note-link' : 'entry-link',
				value: currEl.textContent
			})
		})

	return entityController.entities
}
