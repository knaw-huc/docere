import React from 'react'
import { ContainerContext, isPartialStandoff, StandoffTree3, useComponents } from '@docere/common'
import { DocereTextView } from '@docere/text'

import { EntityComponentProps, EntityWrapper } from './wrapper'
import { TextBody } from './text'

export const XmlEntity = React.memo(function XmlEntity(props: EntityComponentProps) {
	if (props.entity == null) return null

	const containerContext = React.useContext(ContainerContext)

	const components = useComponents(containerContext?.type, containerContext?.id)

	if (!isPartialStandoff(props.entity.props.entityValue)) return null
	const standoffTree = new StandoffTree3(props.entity.props.entityValue)

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
