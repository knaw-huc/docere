import * as React from 'react'
import styled from 'styled-components'
import { DEFAULT_SPACING, LayerType, isFacsimileLayer, FacsimileLayer, Entry, EntryState } from '@docere/common'
import type { EntryStateAction, Layer } from '@docere/common'

const LiWrapper = styled.li`
	color: ${(p: PIWProps) => p.active ? '#EEE' : '#444'};
	cursor: pointer;
	margin-right: 1em;
	white-space: nowrap;
    display: inline-block;
    height: 100%;
	width: 100px;
	
	&:hover {
		color: #AAA;
	}
	
	& > div:first-of-type {
		align-content: center;
		border-radius: 1rem;
		border: 4px ${(p: PIWProps) => p.active ? 'solid #EEE' : 'dashed #444'};
		box-sizing: border-box;
		display: grid;
		font-size: 2em;
		height: 70%;
		justify-content: center;
		width: 100%;

		& > div.text {
			box-sizing: border-box;
			height: 1000px;
			line-height: 3rem;
			padding: 140px;
			text-align: left;
			transform: scale(.09);
			white-space: normal;
			width: 1000px;
		}
	}

	& > div:last-of-type {
		display: grid;
		height: 30%;
		justify-content: center;
		align-content: center;
		font-size: .85rem;
	}
`

interface PIWProps {
	active: boolean
}
interface PIProps {
	className?: string
	dispatch: React.Dispatch<EntryStateAction>
	layer: Layer
}
function Li(props: PIProps) {
	const togglePanel = React.useCallback(ev => {
		props.dispatch({ type: 'TOGGLE_LAYER' , id: ev.currentTarget.dataset.id })			
	}, [])

	return (
		<LiWrapper
			className={props.className}
			data-id={props.layer.id}
			active={props.layer.active}
			onClick={togglePanel}
		>
			{
				props.layer.type !== LayerType.Facsimile ?
					<div><div className="text">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
					</div></div> :
					<div><div /></div>
			}
			<div>{props.layer.title}</div>
		</LiWrapper>
	)
}

interface P {
	entry: Entry
	layer: FacsimileLayer
}
const LiFacs = styled(Li)`
	${(p: P) => {
		// const activeFacsimile = p.entry.textData.facsimiles.get(p.layer.activeFacsimileId)
		// const path = activeFacsimile != null ?
		// 	activeFacsimile.versions[0].path.replace('info.json', `full/!100,100/0/default.jpg`) :
		// 	''
		const path = ''

		return `& > div:first-of-type {
			display: block;

			& > div {
				background-image: url(${path});
				background-repeat: no-repeat;
				background-position: 50%, 50%;
				height: 100%;
				opacity: ${p.layer.active ? 1 : .2};
				width: 100%;
			}
		}`
	}}
`

export const BottomTabWrapper = styled.div`
	bottom: 0;
	left: 0;
	padding: ${DEFAULT_SPACING / 2}px;
	position: absolute;
	right: 0;
	top: 0;
	z-index: ${(props: { active: boolean }) => props.active ? 1 : -1};
`

const Ul = styled.ul`
	height: 100%;
	text-align: center;
` 

interface Props {
	active: boolean
	dispatch: React.Dispatch<EntryStateAction>
	entry: Entry
	layers: EntryState['layers']
}
function Layers(props: Props) {
	return (
		<BottomTabWrapper active={props.active}>
			<Ul>
				{
					Array.from(props.layers.values()).map(tl =>
						isFacsimileLayer(tl) ?
							<LiFacs
								dispatch={props.dispatch}
								entry={props.entry}
								key={tl.id}
								layer={tl}
							/> :
							<Li
								dispatch={props.dispatch}
								key={tl.id}
								layer={tl}
							/>
					)
				}
			</Ul>
		</BottomTabWrapper>
	)
}

export default React.memo(Layers)
