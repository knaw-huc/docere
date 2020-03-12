import * as React from 'react'
import { DocereComponentContainer } from '@docere/common'
import { Rs, getPb } from '@docere/text-components'

export default function getComponents(config: DocereConfig) {
	return async function(container: DocereComponentContainer, _id: string): Promise<DocereComponents> {
		if (container === DocereComponentContainer.Page) return (await import('./pages')).default

		// const placeConfig = config.textData.find(td => td.id === 'loc')
		// const personConfig = config.textData.find(td => td.id === 'per')

		const components2: DocereComponents = {
			// 'ner[type="loc"]': components.rsPlace(placeConfig),
			// 'ner[type="per"]': components.rsPerson(personConfig),
			pb: getPb((props) => props.attributes.facs),
		}

		// Map all the text data configs to components. Person and Loc are overwritten later
		config.entities
			// .filter(td => td.id !== 'per' && td.id !== 'loc')
			.forEach(td => {
				components2[`ner[type="${td.id}"]`] = function(props: DocereComponentProps) {
					const id = (props.children as any)[0]
					return (
						<Rs
							active={props.attributes.type === td.id && props.activeEntity?.id === id}
							config={td}
							customProps={props}
							onClick={() =>
								props.entryDispatch({
									type: 'SET_ENTITY',
									id,
								})
							}
						>
							{props.children}
						</Rs>
					)
				}
			})

		return components2
	}
}
