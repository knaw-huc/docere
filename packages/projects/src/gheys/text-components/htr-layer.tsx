import * as React from 'react'
import styled from 'styled-components'
import { Colors } from '@docere/common'
import type { DocereConfig, DocereComponentProps } from '@docere/common'
import { getPb, Lb, getEntity, PopupBodyProps } from '@docere/text-components'

// function setActiveFacsimileArea(dispatch: React.Dispatch<EntryStateAction>, ids: string[]) {
// 	dispatch({
// 		type: 'SET_ACTIVE_FACSIMILE_AREAS',
// 		ids,
// 	})
// }

// function useActive(props: DocereComponentProps): [boolean, (ev: any) => void] {
// 	const [active, setActive] = React.useState<boolean>(false)

// 	React.useEffect(() => {
// 		setActive(props.activeFacsimileAreas?.some(fa => props.attributes.id === fa.id))
// 	}, [props.activeFacsimileAreas])

// 	const handleClick = React.useCallback(ev => {
// 		ev.stopPropagation()
// 		setActiveFacsimileArea(props.entryDispatch, [props.attributes.id])
// 	}, [props.attributes.id, active])

// 	return [active, handleClick]
// }

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

// TODO fix useActive
function block(props: DocereComponentProps) {
	// const [active, handleClick] = useActive(props)
	return (
		<BlockWrapper
			// active={active}
			active={false}
		>
			{/* <div onClick={handleClick}> */}
			<div>
				□
			</div>
			<section>{props.children}</section>
		</BlockWrapper>
	)
}

const pb = getPb(props => props.attributes.path)

const EntityBodyWrapper = styled.div`
	padding: 1rem;

	.suggestion {
		label {
			font-size: .8rem;
		}

		div {
			color: #222;
		}
	}
`

function EntityBody(props: PopupBodyProps) {
	const { attributes } = props.docereComponentProps
	const rect = attributes.area?.split('_').join(',')
	const activeFacsimile = props.docereComponentProps.layer.activeFacsimile //s.values().next().value

	return (
		<EntityBodyWrapper>
			{
				rect != null &&
				<img
					src={activeFacsimile?.versions[0].path.replace('info.json', `${rect}/240,/0/default.jpg`)}
					width="100%"
				/>
			}
			{
				attributes.suggestion != null && 
				<div className="suggestion">
					<label>suggestion</label>
					<div>{attributes.suggestion}</div>
				</div>
			}
		</EntityBodyWrapper>
	)
}

// function entity(config: DocereConfig) {
// 	return function(props: DocereComponentProps) {
// 		const isEntity = props.attributes.hasOwnProperty('type')
// 		const hasSuggestion = props.attributes.hasOwnProperty('suggestion')
// 		const type = props.attributes.type?.split(' ')[0]

// 		return (
// 			<Entity
// 				customProps={props}
// 				entitiesConfig={config.entities}
// 				entityId={isEntity ? props.attributes.ref : props.attributes.id}
// 				configId={isEntity ? type : 'string'}
// 				PopupBody={EntityBody}
// 				revealOnHover={isEntity || hasSuggestion ? false : true}
// 			>
// 				{props.children}
// 			</Entity>
// 		)
// 	}
// }

type TLWProps = { active: boolean } & DocereComponentProps
const TextLineWrapper = styled(Lb)`
	min-height: 2rem;
	pointer-events: none;

	& * { pointer-events: all; }

	&:before {
		cursor: pointer;
		transition: all 450ms;

		${(props: TLWProps) => 
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

// TODO fix useActive
function line(props: DocereComponentProps) {
	// const [active, handleClick] = useActive(props)

	return (
		<TextLineWrapper
			// active={active}
			active={false}
			// onClick={handleClick}
			{...props}
			// entrySettings={props.entrySettings}
		>
			{props.children}
		</TextLineWrapper>
	)
}


export default function (_config: DocereConfig) {
	// const string = entity(config)

	return {
		block,
		pb,
		'string[suggestion]': getEntity({
			// extractType: () => 'suggestion',
			extractKey: props => props.attributes.id,
			PopupBody: EntityBody,
		}),
		'string[type]': getEntity({
			// extractType: () => 'word',
			extractKey: props => props.attributes.ref,
			PopupBody: EntityBody,
		}),
		line
	}
}


// const Tooltip = styled.div`
// 	background: ${Colors.Red};
// 	border-radius: .2em;
// 	color: white;
// 	display: none;
// 	font-family: sans-serif;
// 	font-weight: normal;
// 	left: -50%;
// 	padding: .5em 1em;
// 	position: absolute;
// 	text-shadow: 1px 1px 1px #585858;
// 	top: 2em;
// 	white-space: nowrap;
// 	z-index: 1;

// 	&:after {
// 		border-color: transparent transparent ${Colors.Red} transparent;
// 		border-style: solid;
// 		border-width: 10px;
// 		content: '';
// 		height: 0;
// 		left: calc(50% - 10px);
// 		position: absolute;
// 		top: -20px;
// 		width: 0;
// 	}
// `

// const Suggestion = styled.span`
// 	border-bottom: 2px dashed ${Colors.Red};
// 	position: relative;

// 	&:hover > div {
// 		display: block;
// 	}
// `

// function StringBody(props: { children: React.ReactNode, suggestion: string }) {
// 	if (props.suggestion == null) return <span>{props.children}</span>

// 	return (
// 		<Suggestion>
// 			{props.children}
// 			<Tooltip>{props.suggestion}</Tooltip>
// 		</Suggestion>
// 	)
// }

// function string(props: DocereComponentProps) {
// 	const [active, handleClick] = useActive(props)

// 	return (
// 		<EntityWrapper
// 			active={active}
// 			color={Colors.Red}
// 			onClick={handleClick}
// 			revealOnHover
// 		>
// 			<StringBody suggestion={props.attributes.suggestion}>
// 				{props.children}
// 			</StringBody>
// 		</EntityWrapper>
// 	)
// }
