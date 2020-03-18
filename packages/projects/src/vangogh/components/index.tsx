import * as React from 'react'
import styled from 'styled-components'
import { Note, getPb, Rs, Lb } from '@docere/text-components'
import { DocereComponentContainer } from '@docere/common'

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

// const getComponents: GetComponents = function(config: DocereConfig) {
export default function getComponents(config: DocereConfig) {
	return async function(_container: DocereComponentContainer, _id: string) {
		const personConfig = config.entities.find(td => td.id === 'pers')
		return {
			ab: styled.div`margin-bottom: 1rem;`,
			anchor: (props: DocereComponentProps) =>
				<Note
					{...props}
					id={props.attributes['xml:id']}
					n={props.attributes.n}
					title={`Note ${props.attributes.n}`}
				/>, 
			lb: (props: DocereComponentProps) => <Lb showLineBeginnings={props.entrySettings['panels.text.showLineBeginnings']} />,
			pb: getPb(props => props.attributes.facs.slice(1)),
			ref,
			'rs[type="pers"]': person(personConfig),
		}
	}
}
