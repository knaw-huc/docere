import * as React from 'react'
import { DocereComponentContainer } from '@docere/common'
import type { DocereConfig, DocereComponents } from '@docere/common'
import { Entity, getPb } from '@docere/text-components'

export default function getComponents(config: DocereConfig) {
	return async function(container: DocereComponentContainer, _id: string): Promise<DocereComponents> {
		if (container === DocereComponentContainer.Page) return (await import('./pages')).default

		// const placeConfig = config.textData.find(td => td.id === 'loc')
		// const personConfig = config.textData.find(td => td.id === 'per')

		const components2: DocereComponents = {
			// 'ner[type="loc"]': components.rsPlace(placeConfig),
			// 'ner[type="per"]': components.rsPerson(personConfig),
			pb: getPb((props) => props.attributes.facs),
			ner: (props) => (
				<Entity
					customProps={props}
					configId={props.attributes.type}
					entitiesConfig={config.entities}
					entityId={(props.children as any)[0]}
				>
					{props.children}
				</Entity>
			)

		}

		// // Map all the text data configs to components. Person and Loc are overwritten later
		// config.entities
		// 	// .filter(td => td.id !== 'per' && td.id !== 'loc')
		// 	.forEach(td => {
		// 		components2[`ner[type="${td.id}"]`] = function(props: DocereComponentProps) {
		// 			const id = (props.children as any)[0]
		// 			return (
		// 				<Entity
		// 					customProps={props}
		// 					configId={td.id}
		// 					entitiesConfig={config.entities}
		// 					id={id}
		// 				>
		// 					{props.children}
		// 				</Entity>
		// 			)
		// 		}
		// 	})

		return components2
	}
}
