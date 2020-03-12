import * as React from 'react'
import styled from 'styled-components'
import { getPb, Popup, Rs } from '@docere/text-components'
import { DocereComponentContainer, Colors } from '@docere/common'

interface NAProps { active: boolean, layer: TextLayer }
const NoteAnchor = styled.div`
	background-color: ${(props: NAProps) => props.active ? Colors.Brown : 'white' };
	border-radius: 1em;
	border: 2px solid ${Colors.Brown};
	color: ${props => props.active ? 'white' : Colors.Brown };
	cursor: pointer;
	display: inline-block;
	font-family: monospace;
	font-size: .8rem;
	font-weight: bold;
	height: 1.4em;
	line-height: 1.4em;
	margin: 0 .25em;
	position: ${props => props.layer.asideActive ? 'static' : 'relative'};
	text-align: center;
	transition: all 150ms;
	width: 1.6em;
`

const Ref = styled.span`border-bottom: 1px solid green;`
const ref = function(props: DocereComponentProps) {
	const handleClick = React.useCallback((ev: React.MouseEvent<HTMLSpanElement>) => {
		ev.stopPropagation()
		const [entryFilename, noteId] = props.attributes.target.split('#')
		if (noteId != null && noteId.length) console.log(`[WARNING] Note ID "${noteId}" is not used`)
		props.appDispatch({ type: 'SET_ENTRY_ID', id: entryFilename.slice(0, -4) })
	}, [])

	return (
		<Ref onClick={handleClick}>
			{props.children}
		</Ref>
	)
}

function person(personConfig: EntityConfig) {
	return function Person(props: DocereComponentProps) {
		return (
			<Rs
				active={props.attributes.key === props.activeEntity?.id}
				config={personConfig}
				customProps={props}
				onClick={ev => {
					ev.stopPropagation()
					props.entryDispatch({ type: 'SET_ENTITY', id: props.attributes.key })
				}}
			>
				{props.children}
			</Rs>
		)
	}
}

function anchor(props: DocereComponentProps) {
	const active = props.attributes.n === props.activeNote?.targetId

	return (
		<NoteAnchor
			active={active}
			layer={props.layer}
			onClick={_ev => {
				// console.log(props.entry.notes, props.attributes['xml:id'], )
				props.entryDispatch({ type: 'SET_NOTE', id: props.attributes['xml:id'] })
			}}
		>
			{props.attributes.n}
			<Popup
				active={active}
				docereComponentProps={props}
				node={props.entry.notes?.find(n => n.id === props.attributes['xml:id'])?.el}
				title={`Note ${props.attributes.n}`}
			/>
		</NoteAnchor>
	)
}

// const getComponents: GetComponents = function(config: DocereConfig) {
export default function getComponents(config: DocereConfig) {
	return async function(_container: DocereComponentContainer, _id: string) {
		const personConfig = config.entities.find(td => td.id === 'pers')
		return {
			ref,
			pb: getPb(props => props.attributes.facs.slice(1)),
			'rs[type="pers"]': person(personConfig),
			anchor,
		}
	}
}
