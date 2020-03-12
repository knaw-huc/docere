import { DocereComponentContainer } from '@docere/common'

export default function getComponents(config: DocereConfig) {
	const configByType = config.entities.map(td => ([td.id, td])) as [string, EntityConfig][]

	return async function(container: DocereComponentContainer, id: 'text' | 'suggestions'): Promise<DocereComponents> {
		const init = (await import('./htr-layer')).default
		const components = init(new Map(configByType))

		if (container === DocereComponentContainer.Layer) {
			return components[id]
		}
	}
}
