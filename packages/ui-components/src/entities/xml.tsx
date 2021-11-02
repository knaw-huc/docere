import React from 'react'
import { ContainerContext, PartialStandoff, StandoffTree3, useComponents } from '@docere/common'
import { DocereTextView } from '@docere/text'

import { EntityComponentProps, EntityWrapper } from './wrapper'
import { TextBody } from './text'

export const XmlEntity = React.memo(function XmlEntity(props: EntityComponentProps) {
	if (props.entity == null) return null

	const containerContext = React.useContext(ContainerContext)

	const components = useComponents(containerContext?.type, containerContext?.id)
	const standoffTree = new StandoffTree3(props.entity.props.entityValue as PartialStandoff)

	return (
		<EntityWrapper
			entity={props.entity}
		>
			<TextBody>
				<DocereTextView 
					components={components}
					standoffTree={standoffTree}
				/>
			</TextBody>
		</EntityWrapper>
	)
})
