import * as React from 'react'
import styled from '@emotion/styled'
import ActiveArea, { activeAreaRGB } from './active-area'
import { TEXT_PANEL_MINIMAP_WIDTH, DEFAULT_SPACING, TEXT_PANEL_GUTTER_WIDTH, TEXT_PANEL_TEXT_WIDTH } from '@docere/common'

const Wrapper = styled.div`
	bottom: 0;
	box-sizing: border-box;
	left: calc(${TEXT_PANEL_GUTTER_WIDTH + TEXT_PANEL_TEXT_WIDTH + DEFAULT_SPACING}px);
	overflow: auto;
	padding-top: ${(props: { hasHeader: boolean }) => props.hasHeader ? 2 * DEFAULT_SPACING : DEFAULT_SPACING}px;
	position: absolute;
	scrollbar-width: none;
	top: 0;
	width: ${TEXT_PANEL_MINIMAP_WIDTH}px;
	z-index: -1;

	&::-webkit-scrollbar {
		display: none;
	}

	& div.container {
		box-sizing: border-box;
		transform: scaleX(.1) scaleY(.1);
		transform-origin: top left;
		width: 480px;
	}

	&:hover .active-area {
		background: rgba(${activeAreaRGB}, .5);
	}
`

const Blocker = styled.div`
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	pointer-events: all;
	top: 0;
	z-index: 1;
`

const Bar = styled.div`
	position: absolute;
	top: ${(props: any) => props.top}px;
	height: .3em;
	background-color: rgba(255, 255, 0, 1);
	margin-top: -.07em;
	width: 100%;
`

interface Props {
	activeAreaRef: React.RefObject<HTMLDivElement>
	hasHeader: boolean
	highlightAreas: number[]
	isReady: boolean
	textWrapperRef: React.RefObject<HTMLDivElement>
}
function Minimap(props: Props) {
	const miniMapRef = React.useRef<HTMLDivElement>()

	React.useEffect(() => {
		// Handle the mouse wheel: scroll the text wrapper
		function handleWheel(ev: WheelEvent) {
			ev.preventDefault()
			props.textWrapperRef.current.scrollTo({
				top: props.textWrapperRef.current.scrollTop += ev.deltaY,
				behavior: 'smooth'
			})
			return false
		}

		miniMapRef.current.querySelector('.blocker').addEventListener('wheel', handleWheel)
		miniMapRef.current.querySelector('.active-area').addEventListener('wheel', handleWheel)
	}, [])

	React.useEffect(() => {
		if (props.isReady) {
			props.textWrapperRef.current.scrollTop = 0
			const current = miniMapRef.current.querySelector('.container')
			if (current) current.innerHTML = ''
			current.appendChild(props.textWrapperRef.current.firstChild.cloneNode(true))
		}
	}, [props.isReady])

	return (
		<Wrapper
			className="minimap"
			hasHeader={props.hasHeader}
			onWheel={() => false}
			ref={miniMapRef}
		>
			<ActiveArea
				activeAreaRef={props.activeAreaRef}
				textWrapperRef={props.textWrapperRef}
			/>
			<Blocker className="blocker" />
			<div style={{ position: 'relative' }}>
				{props.highlightAreas.map((ha: number) => {
					return <Bar key={ha} top={(ha - 64)/10} />
				})}
			</div>
			<div className="container" />
		</Wrapper>
	)
}

export default React.memo(Minimap)
