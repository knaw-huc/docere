import React from 'react'
import { UIComponentType } from '@docere/common'
import styled from 'styled-components'
import { EntityComponentProps, EntityWrapper } from '@docere/ui-components'

const Dl = styled.dl`
	line-height: 1rem;
	margin: 0;
	padding: 1rem;

	& > div {
		margin-bottom: 1rem;
	}

	dt {
		color: #888;
		font-size: .66rem;
		text-transform: uppercase;
	}

	dt, dd {
		margin: 0;
		padding: 0;
	}

	dd {
		font-size: 1rem;
	}
`

const PosEntity = React.memo(function(props: EntityComponentProps) {
	const { attributes } = props.entity
	return (
		<EntityWrapper entity={props.entity}>
			<Dl>
				<div>
					<dt>Origineel</dt>
					<dd>{attributes.value}</dd>
				</div>
				<div>
					<dt>Contemporain</dt>
					<dd>{attributes.contemporary}</dd>
				</div>
				<div>
					<dt>pos</dt>
					<dd>{attributes.pos}</dd>
				</div>
				<div>
					<dt>pos sub</dt>
					<dd>{attributes.possub}</dd>
				</div>
				{
					attributes.type &&
					<div>
						<dt>NER type</dt>
						<dd>{attributes.type}</dd>
					</div>
				}
			</Dl>
		</EntityWrapper>
	)
})

export default function getUIComponents() {
	return async function(componentType: UIComponentType, id: string): Promise<React.FC<any>> {
		if (componentType === UIComponentType.SearchResult) return (await import('./search-result')).default
		else if (componentType === UIComponentType.Entity) {
			if (id === 'pos') return PosEntity
		}
	}
}
