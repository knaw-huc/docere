import React from 'react'
import { useComponents, DocereComponentContainer, useEntry, Entity, useNavigate } from '@docere/common'
import DocereTextView from '@docere/text'

import { PopupBodyLink, PopupBodyWrapper } from './index'

import type { DocereComponentProps, UrlObject } from '@docere/common'

interface NoteLinkProps {
	activeEntity: Entity
	entryId: string
	noteId: string
	children: React.ReactNode
}
function NoteLink(props: NoteLinkProps) {
	const navigate = useNavigate()

	const handleClick = React.useCallback((ev: React.MouseEvent) => {
		ev.stopPropagation()

		const payload: UrlObject = {
			entryId: props.entryId,
			query: { noteId: props.noteId }
		}

		navigate(payload)
	}, [props.entryId, props.noteId])

	return (
		<PopupBodyLink
			entityConfig={props.activeEntity.config}
			onClick={handleClick}
		>
			{props.children}
		</PopupBodyLink>
	)
}

export default function NoteLinkPopupBody(props: DocereComponentProps) {
	if (props.activeEntity == null) return null

	const [fileName, noteId] = props.activeEntity.id.split('#')
	const entry = useEntry(fileName.replace(/\.xml$/, ''))
	const components = useComponents(DocereComponentContainer.Layer)

	if (entry == null) return null
	const note = entry.notes.find(n => n.id === noteId)
	if (note == null) return null

	return (
		<PopupBodyWrapper>
			<DocereTextView
				customProps={props}
				components={components}
				node={note.element}
			/>
			<NoteLink
				activeEntity={props.activeEntity}
				entryId={entry.id}
				noteId={noteId}
			>
				Go to note in entry {entry.id}
			</NoteLink>
		</PopupBodyWrapper>
	)
}

