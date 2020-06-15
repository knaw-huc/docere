import React from 'react'

import { VIEW_BOX_WIDTH } from './index'

interface Props {
	onMouseDown: (ev: any) => void
	onTouchStart: (ev: any) => void
	percentage: number
	radius: number
	strokeWidth: number
}
export default (props: Props) => {
	return <circle
		cx={(props.radius + props.strokeWidth/2) + (props.percentage * VIEW_BOX_WIDTH)}
		cy={props.radius + props.strokeWidth/2}
		fill="white"
		onMouseDown={props.onMouseDown}
		onTouchStart={props.onTouchStart}
		r={props.radius}
		stroke="gray"
		strokeWidth={props.strokeWidth}
	/>
}
