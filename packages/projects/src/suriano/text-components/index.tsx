import React from 'react'
import styled from 'styled-components'
import { ContainerType, ContainerContext, ContainerContextValue, EntitiesContext, ProjectContext } from '@docere/common'
import type { DocereConfig } from '@docere/common'
import { Lb, Pb, EntityTag, Hi } from '@docere/text-components'

interface PWProps {
	active: boolean
	color: string
	container: ContainerContextValue
}
const PersonWrapper = styled.div`
	font-size: 16px;
	padding: 1rem;


	${(props: PWProps) => {
		if (props.container.type === ContainerType.Page) {
			return `
				box-shadow: 0 0 6px #ddd;
				margin: 2rem 0;
				${props.active ? `border-left: 6px solid ${props.color}` : ''};
			`
		}
	}};
`

function Person(props: any) {
	const container = React.useContext(ContainerContext)
	const activeEntities = React.useContext(EntitiesContext)
	const { config } = React.useContext(ProjectContext)
	const entityConfig = config.entities2.find(c => c.id === 'personography')

	return (
		<PersonWrapper
			active={activeEntities.has(props.attributes['xml:id'])}
			color={entityConfig.color}
			container={container}
		>
			{props.children}
		</PersonWrapper>
	)
}

export default function getComponents(_config: DocereConfig) {
	return async function(container: ContainerType, _id: string) {
		if (container === ContainerType.Page) {
			return {
				person: React.memo(Person),
				name: styled.div`font-weight: bold;`,
			}
		}

		return {
			// teiHeader: NoOp,
			// 'section.footnotes': NoOp,
			// head: NoOp,
			// header: NoOp,
			hi: Hi,
			// 'a.footnote-ref': Note,
			pb: Pb,
			lb: Lb,
			ptr: EntityTag,
			rs: EntityTag,
		}
	}
}
