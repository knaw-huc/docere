import { DocereComponentContainer } from '@docere/common'
import type { DocereConfig, DocereComponents } from '@docere/common'
import { getPb } from '@docere/text-components'

export default function getComponents(_config: DocereConfig) {
	return async function(container: DocereComponentContainer, _id: string): Promise<DocereComponents> {
		if (container === DocereComponentContainer.Page) return (await import('./pages')).default

		const components2: DocereComponents = {
			pb: getPb((props) => props.attributes.facs),
		}

		return components2
	}
}
