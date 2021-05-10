import styled from 'styled-components'
import React from 'react'

import { EntityWrapper, EntityComponentProps } from './wrapper'
import { DocereAnnotation } from '@docere/common'

export const TextBody = styled.div`
	padding: .25rem .5rem;
`
export const TextEntity = React.memo(function TextEntity(props: EntityComponentProps) {
	return (
		<EntityWrapper
			entity={props.entity}
		>
			{
				<TextBody>
					{extractText(props.entity)}
				</TextBody>
			}
		</EntityWrapper>
	)
})

function extractText(annotation: DocereAnnotation): string {
	if (annotation.props._textContent?.length) {
		return annotation.props._textContent
	}

	return annotation.children?.map(child =>
		(typeof child === 'string') ?
			child :
			extractText(child)
	).join('')
}
