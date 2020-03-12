import * as React from 'react'
import styled from '@emotion/styled'

const LiWrapper = styled.li`
	color: ${(p: PIWProps) => p.active ? '#EEE' : '#444'};
	cursor: pointer;
	margin-right: 1em;
	white-space: nowrap;
    display: inline-block;
    height: 100%;
    width: 100px;
	
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
	}

	& > div:last-of-type {
		display: grid;
		height: 30%;
		justify-content: center;
		align-content: center;
	}
`

interface PIWProps {
	active: boolean
}
interface PIProps {
	dispatch: React.Dispatch<EntryStateAction>
	layer: Layer
}
function Li(props: PIProps) {
	const togglePanel = React.useCallback(ev => {
		props.dispatch({ type: 'TOGGLE_LAYER' , id: ev.currentTarget.dataset.id })			
	}, [])

	return (
		<LiWrapper
			data-id={props.layer.id}
			active={props.layer.active}
			onClick={togglePanel}
		>
			<div>{props.layer.title.slice(0, 1)}</div>
			<div>{props.layer.title}</div>
		</LiWrapper>
	)
}

interface Props {
	dispatch: React.Dispatch<EntryStateAction>
	layers: Layer[]
}
function Layers(props: Props) {
	return (
		<ul>
			{
				props.layers.map(tl =>
					<Li
						dispatch={props.dispatch}
						key={tl.id}
						layer={tl}
					/>
				)
			}
		</ul>
	)
}

export default React.memo(Layers)
