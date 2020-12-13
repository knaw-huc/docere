import { ContainerType } from '@docere/common'
import type { DocereConfig, DocereComponents } from '@docere/common'
import { Pb } from '@docere/text-components'

export default function getComponents(_config: DocereConfig) {
	return async function(container: ContainerType, _id: string): Promise<DocereComponents> {
		if (container === ContainerType.Page) return (await import('./pages')).default

		const components2: DocereComponents = {
			// pb: getPb((props) => props.attributes.facs),
			pb: Pb
		}

		return components2
	}
}
