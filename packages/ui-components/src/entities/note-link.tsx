import React from 'react'
import { useComponents, DocereComponentContainer, Entity, useEntry, ProjectContext } from '@docere/common'
import DocereTextView from '@docere/text'

import { LinkFooter, EntityWithLinkWrapper } from './link-wrapper'

import { EntityComponentProps, EntityWrapper } from './wrapper'

interface NoteLinkProps {
	entity: Entity
	entryId: string
	children: React.ReactNode
}
function NoteLink(props: NoteLinkProps) {
	// const { setEntry } = React.useContext(EntryContext)

	const handleClick = React.useCallback((ev: React.MouseEvent) => {
		ev.stopPropagation()

		// TODO fix with dispatch
		// setEntry({ entryId: props.entryId, entityIds: new Set([props.entity.id]) })
	}, [props.entryId, props.entity])

	return (
		<LinkFooter
			entity={props.entity}
			onClick={handleClick}
		>
			{props.children}
		</LinkFooter>
	)
}

export const NoteLinkEntity = React.memo(function(props: EntityComponentProps) {
	const { config } = React.useContext(ProjectContext)
	const [fileName] = props.entity.id.split('#')
	const entry = useEntry(config.slug, fileName.replace(/\.xml$/, ''))
	const components = useComponents(DocereComponentContainer.Layer)

	return (
		<EntityWrapper entity={props.entity}>
			<EntityWithLinkWrapper>
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
			</EntityWithLinkWrapper>
		</EntityWrapper>
	)
})

