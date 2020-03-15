import * as React from 'react'
import styled from 'styled-components'
import { Colors } from '@docere/common'
import { EntityWrapper, Rs, getPb, Lb } from '@docere/text-components'

const TextLineWrapper = styled(Lb)`
	min-height: 2rem;
	pointer-events: none;

	& * { pointer-events: all; }

	&:before {
		cursor: pointer;
		transition: all 450ms;

		${(props: { active: boolean }) => 
			props.active ?
				`background: ${Colors.Red};
				color: white;
				font-weight: bold;
				` :
				`&:hover {
					border-bottom: 3px solid ${Colors.Red};
					color: ${Colors.Red}
				}`
		}
		
		pointer-events: all;
	}
`

const BlockWrapper = styled.div`
	& > div {
		cursor: pointer;
		display: inline-block;
		line-height: 1rem;
		text-align: center;
		transition: all 450ms;
		width: 1rem;

		${(props: { active: boolean }) => 
			props.active ?
				`background: ${Colors.Red};
				color: white;
				font-weight: bold;
				` :
				`&:hover {
					color: ${Colors.Red};
				}`
		}
	}

	& > section {
		margin: 0 0 2rem 0;
	}
`

function setActiveFacsimileArea(dispatch: React.Dispatch<EntryStateAction>, ids: string[]) {
	dispatch({
		type: 'SET_ACTIVE_FACSIMILE_AREAS',
		ids,
	})
}

function useActive(props: DocereComponentProps): [boolean, (ev: any) => void] {
	const [active, setActive] = React.useState<boolean>(false)

	React.useEffect(() => {
		setActive(props.activeFacsimileAreas?.some(fa => props.attributes.id === fa.id))
	}, [props.activeFacsimileAreas])

	const handleClick = React.useCallback(ev => {
		ev.stopPropagation()
		setActiveFacsimileArea(props.entryDispatch, [props.attributes.id])
	}, [props.attributes.id, active])

	return [active, handleClick]
}

function block(props: DocereComponentProps) {
	const [active, handleClick] = useActive(props)
	return (
		<BlockWrapper
			active={active}
		>
			<div onClick={handleClick}>
				□
			</div>
			<section>{props.children}</section>
		</BlockWrapper>
	)
}

const pb = getPb(props => props.attributes.path)

function entity(configByType: Map<string, EntityConfig>) {
	return function Entity(props: DocereComponentProps) {
		const handleClick = React.useCallback(ev => {
			ev.stopPropagation()
			props.entryDispatch({
				type: 'SET_ENTITY',
				id: props.attributes.ref,
			})
		}, [])

		const type = props.attributes.type.split(' ')[0]

		return (
			<Rs
				active={
					(
						props.activeEntity != null &&
						props.activeEntity.id === props.attributes.ref
					) ||
					props.activeFacsimileAreas?.some(fa => props.attributes.area.indexOf(fa.id) > -1)
				}
				config={configByType.get(type)}
				customProps={props}
				onClick={handleClick}
			>
				{props.children}
			</Rs>
		)
	}
}

const Tooltip = styled.div`
	background: ${Colors.Red};
	border-radius: .2em;
	color: white;
	display: none;
	font-family: sans-serif;
	font-weight: normal;
	left: -50%;
	padding: .5em 1em;
	position: absolute;
	text-shadow: 1px 1px 1px #585858;
	top: 2em;
	white-space: nowrap;
	z-index: 1;

	&:after {
		border-color: transparent transparent ${Colors.Red} transparent;
		border-style: solid;
		border-width: 10px;
		content: '';
		height: 0;
		left: calc(50% - 10px);
		position: absolute;
		top: -20px;
		width: 0;
	}
`

const Suggestion = styled.span`
	border-bottom: 2px dashed ${Colors.Red};
	position: relative;

	&:hover > div {
		display: block;
	}
`

function StringBody(props: { children: React.ReactNode, suggestion: string }) {
	if (props.suggestion == null) return <span>{props.children}</span>

	return (
		<Suggestion>
			{props.children}
			<Tooltip>{props.suggestion}</Tooltip>
		</Suggestion>
	)
}

function string(props: DocereComponentProps) {
	const [active, handleClick] = useActive(props)

	return (
		<EntityWrapper
			active={active}
			color={Colors.Red}
			onClick={handleClick}
			revealOnHover
		>
			<StringBody suggestion={props.attributes.suggestion}>
				{props.children}
			</StringBody>
		</EntityWrapper>
	)
}

function line(props: DocereComponentProps) {
	const [active, handleClick] = useActive(props)

	return (
		<TextLineWrapper
			active={active}
			onClick={handleClick}
			showLineBeginnings={props.entrySettings['panels.text.showLineBeginnings']}
		>
			{props.children}
		</TextLineWrapper>
	)
}


export default (configByType: Map<string, EntityConfig>) => ({
	text: {
		block,
		pb,
		'string[type]': entity(configByType),
		string,
		line
	},
	suggestions: {
		block,
		pb,
		string,
		line
	}
})
