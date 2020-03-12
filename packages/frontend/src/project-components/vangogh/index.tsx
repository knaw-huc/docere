/// <reference path="../../types.d.ts" />

import * as React from 'react'
import styled from '@emotion/styled'
import { rsPerson } from '../rs';
import { BROWN_DARK, AsideTab } from '../../constants'
import getPb from '../pb';

interface NAProps { active: boolean }
const NoteAnchor = styled.span`
	background-color: ${(props: NAProps) => props.active ? BROWN_DARK : 'white' };
	border-radius: 1em;
	border: 2px solid ${BROWN_DARK};
	color: ${props => props.active ? 'white' : BROWN_DARK };
	cursor: pointer;
	display: inline-block;
	font-family: monospace;
	font-size: .8rem;
	font-weight: bold;
	height: 1.4em;
	line-height: 1.4em;
	margin: 0 .25em;
	text-align: center;
	transition: all 150ms;
	width: 1.6em;
`

const Ref = styled.span`border-bottom: 1px solid green;`
const ref = function(props: DocereComponentProps & { target: string }) {
	return (
		<Ref
			onClick={(_ev: React.MouseEvent<HTMLSpanElement>) => {
				_ev.stopPropagation()
				const [entryFilename, noteId] = props.target.split('#')
				if (noteId != null && noteId.length) console.log(`[WARNING] Note ID "${noteId}" is not used`)
				props.setEntry(entryFilename.slice(0, -4))
			}}
		>
			{props.children}
		</Ref>
	)
}

const getComponents: GetComponents = function(config: DocereConfig) {
	const personConfig = config.textdata.find(td => td.id === 'person')
	return {
		ref,
		pb: getPb((props) => props.facs.slice(1)),
		'rs[type="pers"]': rsPerson(personConfig),
		anchor: (props: DocereComponentProps & { n: string }) => {
			return (
				<NoteAnchor
					active={props.n === props.activeId}
					onClick={() => props.setActiveId(props.n, 'editorNotes', AsideTab.Notes)}
				>
					{props.n}
				</NoteAnchor>
			)
		},
	}
}

export default getComponents
