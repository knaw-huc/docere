import styled from 'styled-components'
import React from 'react'

import { EntityWrapper, EntityComponentProps } from './wrapper'

export const TextBody = styled.div`
	padding: .25rem .5rem;
`
export const TextEntity = React.memo(function TextEntity(props: EntityComponentProps) {
	return (
		<EntityWrapper entity={props.entity}>
			<TextBody>
				{props.entity.content}
			</TextBody>
		</EntityWrapper>
	)
})
