import React from 'react'
import { useComponents, ContainerType } from '@docere/common'
import { DocereTextView } from '../../../text/src/index'

import { LinkFooter, EntityWithLinkWrapper } from './link-wrapper'

import { EntityComponentProps, EntityWrapper } from './wrapper'

interface NoteLinkProps extends EntityComponentProps {
	entryId: string
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

// TODO add tree from entry.layers[0].tree lookup?
export const NoteLinkEntity = React.memo(function(props: EntityComponentProps) {
	const [fileName] = props.entity.props._entityId.split('#')
	// TODO this does not work anymore with standoff
	const entryId = fileName.replace(/\.xml$/, '')
	const components = useComponents(ContainerType.Layer)

	return (
		<EntityWrapper
			entity={props.entity}
		>
			<EntityWithLinkWrapper>
				<DocereTextView
					components={components}
					tree={null}
				/>
				<NoteLink
					entity={props.entity}
					entryId={entryId}
				>
					Go to note in entry {entryId}
				</NoteLink>
			</EntityWithLinkWrapper>
		</EntityWrapper>
	)
})

