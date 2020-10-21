import React from 'react'
import { useComponents, DocereComponentContainer, useEntry, Entity, useNavigate } from '@docere/common'
import DocereTextView from '@docere/text'

import { PopupBodyLink, PopupBodyWrapper } from './index'

import type { UrlObject } from '@docere/common'
import { PopupBodyProps } from '..'

interface NoteLinkProps {
	entity: Entity
	entryId: string
	children: React.ReactNode
}
function NoteLink(props: NoteLinkProps) {
	const navigate = useNavigate()

	const handleClick = React.useCallback((ev: React.MouseEvent) => {
		ev.stopPropagation()

		const payload: UrlObject = {
			entryId: props.entryId,
			query: { entityId: [props.entity.id] }
		}

		navigate(payload)
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

export default function NoteLinkPopupBody(props: PopupBodyProps) {
	const [fileName] = props.entity.id.split('#')
	const entry = useEntry(fileName.replace(/\.xml$/, ''))
	const components = useComponents(DocereComponentContainer.Layer)

	return (
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
	)
}

