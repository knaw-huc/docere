import { DocereComponentContainer } from '@docere/common'
import { DocereConfig, DocereComponents } from '@docere/common'

export default function getComponents(_config: DocereConfig) {
	return async function(_container: DocereComponentContainer, id: string): Promise<DocereComponents> {
		if (id === 'alto') return (await import('./alto')).default
		if (id === 'prepared') return (await import('./prepared')).default
	}
}
