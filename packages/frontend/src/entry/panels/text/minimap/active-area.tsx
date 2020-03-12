import * as React from 'react'
import styled from '@emotion/styled'

export const activeAreaRGB = '200, 200, 200'

const Wrapper = styled.div`
	background: rgba(${activeAreaRGB}, 0);
	cursor: pointer;
	position: absolute;
	transition: background 400ms;
	width: 100%;
	z-index: 2;

	&:hover, &.active {
		background: rgba(${activeAreaRGB}, .5);
	}
`


interface Props {
	activeAreaRef: React.RefObject<HTMLDivElement>
	textWrapperRef: React.RefObject<HTMLDivElement>
}
function ActiveArea(props: Props) {

	// Set the initial height of the active area
	React.useEffect(() => {
		let dragging: boolean = false
		let startY: number
		let startTop: number

		const handleMouseDown = (ev: MouseEvent) => {
			dragging = true
			startY = ev.clientY
			startTop = props.textWrapperRef.current.scrollTop
		}

		const handleMouseMove = (ev: any) => {
			if (!dragging) return
			const diff = ev.clientY - startY
			props.textWrapperRef.current.scrollTop = startTop + (diff * 10)
		}

		const handleMouseUp = () => {
			dragging = false
		}

		window.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('mouseup', handleMouseUp)
		props.activeAreaRef.current.addEventListener('mousedown', handleMouseDown)
		props.activeAreaRef.current.style.height = (props.textWrapperRef.current.clientHeight / 10) + 'px'

		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mouseup', handleMouseUp)
			props.activeAreaRef.current.removeEventListener('mousedown', handleMouseDown)
		}
	}, [])

	return (
		<Wrapper
			className="active-area"
			ref={props.activeAreaRef}
		/>
	)
}

export default React.memo(ActiveArea)
