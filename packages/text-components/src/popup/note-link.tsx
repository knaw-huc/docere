import React from 'react'
import { useComponents, DocereComponentContainer, useEntry, ActiveEntity, useNavigate } from '@docere/common'
import DocereTextView from '@docere/text'

import { PopupBodyLink, PopupBodyWrapper } from './body'

import type { DocereComponentProps, NavigatePayload } from '@docere/common'

interface NoteLinkProps {
	activeEntity: ActiveEntity
	entryId: string
	noteId: string
	children: React.ReactNode
}
function NoteLink(props: NoteLinkProps) {
	const navigate = useNavigate()

	const handleClick = React.useCallback((ev: React.MouseEvent) => {
		ev.stopPropagation()

		const payload: NavigatePayload = {
			type: 'entry',
			id: props.entryId,
			query: {
				note: {
					id: props.noteId,
					type: null
				}
			}
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

export function NoteLinkPopupBody(props: DocereComponentProps) {
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
				node={note.el as Element}
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

