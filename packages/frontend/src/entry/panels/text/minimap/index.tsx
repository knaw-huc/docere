import * as React from 'react'
import styled from 'styled-components'
import ActiveArea, { activeAreaRGB } from './active-area'
import { TEXT_PANEL_MINIMAP_WIDTH, DEFAULT_SPACING, PANEL_HEADER_HEIGHT } from '@docere/common'
import debounce from 'lodash.debounce'

const Wrapper = styled.div`
	bottom: 0;
	box-sizing: border-box;
	overflow: auto;
	padding-top: ${DEFAULT_SPACING}px;
	margin-top: ${(props: { hasHeader: boolean }) => props.hasHeader ? PANEL_HEADER_HEIGHT : 0}px;
	position: absolute;
	right: ${DEFAULT_SPACING}px;
	scrollbar-width: none;
	top: 0;
	width: ${TEXT_PANEL_MINIMAP_WIDTH}px;
	z-index: 1;

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
	top: ${(props: { top: number }) => props.top}px;
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

		if (miniMapRef.current == null) return

		miniMapRef.current.querySelector('.blocker').addEventListener('wheel', handleWheel)
		miniMapRef.current.querySelector('.active-area').addEventListener('wheel', handleWheel)

		const handleMutation = debounce(() => {
			const current = miniMapRef.current.querySelector('.container')
			if (current) current.innerHTML = ''
			current.appendChild(props.textWrapperRef.current.firstChild.cloneNode(true))
		}, 350)

		const observer = new MutationObserver(handleMutation)
		observer.observe(props.textWrapperRef.current, { attributes: true, childList: true, subtree: true });
		return () => observer.disconnect();
	}, [])

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
