import React from 'react'
import { useComponents, ContainerContext } from '@docere/common'
import { DocereTextView } from '@docere/text'

import { EntityComponentProps, EntityWrapper } from './wrapper'
import { TextBody } from './text'

export const XmlEntityBody = React.memo(function NoteBody(props: EntityComponentProps) {
	const { type, id } = React.useContext(ContainerContext)
	const components = useComponents(type, id)

	return (
		<TextBody>
			<DocereTextView 
				components={components}
				tree={props.entity}
			/>
		</TextBody>
	)
})

export const XmlEntity = React.memo(function XmlEntity(props: EntityComponentProps) {
	if (props.entity == null) return null

	return (
		<EntityWrapper
			entity={props.entity}
		>
			<XmlEntityBody
				entity={props.entity}
			/>
		</EntityWrapper>
	)
})
