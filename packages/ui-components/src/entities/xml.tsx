import React from 'react'
import { useComponents, ContainerType } from '@docere/common'
import DocereTextView from '@docere/text'

import { EntityComponentProps, EntityWrapper } from './wrapper'
import { TextBody } from './text'

export const XmlEntityBody = React.memo(function NoteBody(props: EntityComponentProps) {
	const components = useComponents(ContainerType.Layer, props.entity.layerId)
	return (
		<TextBody>
			<DocereTextView 
				components={components}
				xml={props.entity.content}
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
			<XmlEntityBody entity={props.entity} />
		</EntityWrapper>
	)
})
