import * as React from 'react'
import styled from 'styled-components'
import DocereTextView from '@docere/text_'
import ProjectContext from '../../../app/context'
import { Colors } from '@docere/common'
import type { EntryState, AppStateAction, DocereComponents, Entry, EntryStateAction, DocereComponentProps, Note } from '@docere/common'

const Li = styled.li`
	color: ${(props: { active: boolean }) => props.active ? '#FFF' : '#BBB' };
	cursor: pointer;
	display: grid;
	grid-template-columns: 1fr 9fr;
	line-height: 1.6rem;
	margin-bottom: 1em;
	padding: 0 1em 0 calc(16px + 1em);
	position: relative;
`

interface AIProps {
	active: boolean
	color: string
}
const ActiveIndicator = styled.div`
	background: ${(props: AIProps) => props.active ? props.color : 'rgba(0, 0, 0, 0)'};
	height: ${props => props.active ? '100%' : 0};
	left: 8px;
	position: absolute;
	top: 0;
	transition: top 120ms ease-out;
	width: 8px;
`

type Props = Pick<EntryState, 'activeEntity' | 'activeFacsimile' | 'activeFacsimileAreas' | 'activeNote' | 'settings'> & {
	active: boolean
	appDispatch: React.Dispatch<AppStateAction>
	components: DocereComponents
	entry: Entry
	entryDispatch: React.Dispatch<EntryStateAction>
	note: Note
	listId: string
}

// TODO render all notes in main /entry/index.tsx and pass rendered notes as props to popup and aside
export default function Note(props: Props) {
	const projectContext = React.useContext(ProjectContext)
	const handleClick = React.useCallback(() => {
		props.entryDispatch({ type: 'SET_NOTE', id: props.note.id })
	}, [props.note, props.listId])

	const customProps: DocereComponentProps = {
		activeFacsimileAreas: props.activeFacsimileAreas,
		activeFacsimile: props.activeFacsimile,
		activeEntity: props.activeEntity,
		activeNote: props.activeNote,
		appDispatch: props.appDispatch,
		components: props.components,
		config: projectContext.config,
		entry: props.entry,
		entryDispatch: props.entryDispatch,
		entrySettings: props.settings,
		insideNote: false,
		layer: null
	}

	return (
		<Li
			active={props.active}
			onClick={handleClick}
		>
			<div>{props.note.n}</div>
			<div>
				{
					typeof props.note.el === 'string' ?
						props.note.el :
						<DocereTextView
							components={props.components}
							customProps={customProps}
							node={props.note.el}
						/>
				}
			</div>
			<ActiveIndicator
				active={props.active}
				color={Colors.BrownLight}
			/>
		</Li>
	)
}
