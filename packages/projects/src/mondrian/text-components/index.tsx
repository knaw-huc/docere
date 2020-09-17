import { DocereComponentContainer } from '@docere/common'
import entryComponents from './entry'
import biblioComponents from './pages/biblio'
import bioComponents from './pages/bio'

import type { DocereConfig } from '@docere/common'

export default function getComponents(config: DocereConfig) {
	return async function(container: DocereComponentContainer, _id: string) {
		if (container === DocereComponentContainer.Page) {
			if (_id === 'biblio') return await biblioComponents()
			if (_id === 'bio') return await bioComponents()
		} else if (container === DocereComponentContainer.Layer) {
			return await entryComponents(config)
		}
	}
}
