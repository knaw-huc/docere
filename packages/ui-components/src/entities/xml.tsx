import React from 'react'
// import { ContainerContext } from '@docere/common'
// import { DocereTextView } from '@docere/text'

import { EntityComponentProps, EntityWrapper } from './wrapper'
import { TextBody } from './text'

// TODO be able to render an entity with DocereTextView. This used to work
// when DocereTextView rendered from an annotation, but now a StandoffTree3
// has to be created. In order to do that we need acces to layer.standoffTree3
// and request a new StandoffTree3 from an annotation
export const XmlEntityBody = React.memo(function NoteBody(_props: EntityComponentProps) {
	// const { type, id } = React.useContext(ContainerContext)
	// const components = useComponents(type, id)

	return (
		<TextBody>
			{/* <DocereTextView 
				components={components}
				tree={props.entity}
			/> */}
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
