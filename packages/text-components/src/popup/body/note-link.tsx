import React from 'react'
import { useComponents, DocereComponentContainer, Entity, useEntry, ProjectContext, EntryContext } from '@docere/common'
import DocereTextView from '@docere/text'

import { PopupBodyLink, PopupBodyWrapper } from './index'

import { EntityComponentProps, EntityWrapper } from '..'

interface NoteLinkProps {
	entity: Entity
	entryId: string
	children: React.ReactNode
}
function NoteLink(props: NoteLinkProps) {
	const { setEntry } = React.useContext(EntryContext)

	const handleClick = React.useCallback((ev: React.MouseEvent) => {
		ev.stopPropagation()

		setEntry({ entryId: props.entryId, entityIds: [props.entity.id] })
	}, [props.entryId, props.entity])

	return (
		<PopupBodyLink
			entity={props.entity}
			onClick={handleClick}
		>
			{props.children}
		</PopupBodyLink>
	)
}

export const NoteLinkEntity = React.memo(function(props: EntityComponentProps) {
	const { config } = React.useContext(ProjectContext)
	const [fileName] = props.entity.id.split('#')
	const entry = useEntry(config.slug, fileName.replace(/\.xml$/, ''))
	const components = useComponents(DocereComponentContainer.Layer)

	return (
		<EntityWrapper entity={props.entity}>
			<PopupBodyWrapper>
				<DocereTextView
					customProps={props}
					components={components}
					xml={props.entity.content}
				/>
				<NoteLink
					entity={props.entity}
					entryId={entry.id}
				>
					Go to note in entry {entry.id}
				</NoteLink>
			</PopupBodyWrapper>
		</EntityWrapper>
	)
})

