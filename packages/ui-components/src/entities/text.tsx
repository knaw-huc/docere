import styled from 'styled-components'
import React from 'react'

import { EntityWrapper, EntityComponentProps } from './wrapper'
// import { Annotation3 } from '@docere/common'

export const TextBody = styled.div`
	padding: .25rem .5rem;
`

// TODO restore this. The Annotation3 is passed in the props, but this component
// needs acces to the whole tree to get the text content. How does this component,
// which can also be rendered outside a layer (in the aside or as a popup on the 
// facsimile) access the tree? Pass a reference to the tree to every Annotation3?
export const TextEntity = React.memo(function TextEntity(props: EntityComponentProps) {
	return (
		<EntityWrapper
			entity={props.entity}
		>
			{
				<TextBody>
					{/* {extractText(props.entity)} */}
				</TextBody>
			}
		</EntityWrapper>
	)
})

// function extractText(annotation: Annotation3): string {
// 	if (annotation.props._textContent?.length) {
// 		return annotation.props._textContent
// 	}

// 	return annotation.children?.map(child =>
// 		(typeof child === 'string') ?
// 			child :
// 			extractText(child)
// 	).join('')
// }
