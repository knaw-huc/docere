import { ContainerType } from '@docere/common'
import entryComponents from './entry'
import biblioComponents from './pages/biblio'
import bioComponents from './pages/bio'

import type { DocereConfig } from '@docere/common'

export default function getComponents(config: DocereConfig) {
	return async function(container: ContainerType, _id: string) {
		if (container === ContainerType.Page) {
			if (_id === 'biblio') return await biblioComponents()
			if (_id === 'bio') return await bioComponents()
		} else if (container === ContainerType.Layer || container === ContainerType.Aside) {
			return await entryComponents(config)
		}
	}
}
