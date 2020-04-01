import React from 'react'

import Handle from './handle'

export const VIEW_BOX_WIDTH = 400

interface IOnChangeData extends State {
	refresh: boolean
}

enum MouseState {
	Down,
	Up
}

enum ActiveElement {
	Bar,
	LowerLimit,
	UpperLimit
}

type MouseDownEvent = React.MouseEvent<SVGCircleElement | SVGPathElement> | React.TouchEvent<SVGCircleElement | SVGPathElement>

interface Props {
	handleRadius?: number
	lineWidth?: number
	lowerLimit?: number
	onChange: (data: IOnChangeData) => void
	style: React.CSSProperties
	upperLimit?: number
}
interface State {
	activeElement: ActiveElement
	lowerLimit?: number
	upperLimit?: number
}
class RangeSlider extends React.Component<Props, State> {
	private mouseState = MouseState.Up
	private svgRef: React.RefObject<SVGSVGElement>

	state: State = {
		activeElement: null,
		lowerLimit: this.props.lowerLimit,
		upperLimit: this.props.upperLimit,
	};

	static defaultProps: Partial<Props> = {
		handleRadius: 8,
		lineWidth: 4,
		lowerLimit: 0,
		style: {},
		upperLimit: 1,
	};

	constructor(props: Props) {
		super(props)
		this.svgRef = React.createRef()
	}

	componentDidMount() {
		window.addEventListener('mouseup', this.mouseUp)
		window.addEventListener('touchend', this.mouseUp)
		window.addEventListener('touchmove', this.touchMove)
	}

	componentWillReceiveProps(nextProps: Props) {
		this.setState({
			lowerLimit: nextProps.lowerLimit,
			upperLimit: nextProps.upperLimit,
		});
	}

	componentWillUnmount() {
		window.removeEventListener('mouseup', this.mouseUp)
		window.removeEventListener('touchend', this.mouseUp)
		window.removeEventListener('touchmove', this.touchMove)
	}

	render() {
		const handleOrder: [ActiveElement, ActiveElement] = this.state.activeElement === ActiveElement.LowerLimit ?
			[ActiveElement.UpperLimit, ActiveElement.LowerLimit] :
			[ActiveElement.LowerLimit, ActiveElement.UpperLimit]

		// Add the lineWidth to the view box, because of the handle's stroke
		const viewBoxHeight = this.props.handleRadius * 2 + this.props.lineWidth
		const viewBoxWidth = VIEW_BOX_WIDTH + this.props.handleRadius * 2 + this.props.lineWidth

		return (
			<svg
				ref={this.svgRef}
				style={{
					boxSizing: 'border-box',
					padding: `${this.props.lineWidth/2}px`,
					width: '100%',
					...this.props.style
				}}
				viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
			>
				<path
					d={this.getRangeLine()}
					fill="transparent"
					stroke="lightgray"
					strokeWidth={this.props.lineWidth}
				/>
				<g
					className="current-range-line"
				>
					<path
						stroke="#AAA"
						strokeWidth={this.props.lineWidth}
						d={this.getCurrentRangeLine()}
						onMouseDown={(ev) => this.mouseDown(ActiveElement.Bar, ev)}
						onTouchStart={(ev) => this.mouseDown(ActiveElement.Bar, ev)}
					/>
					{
						handleOrder.map(limit => 
							<Handle
								key={limit}
								strokeWidth={this.props.lineWidth}
								onMouseDown={(ev) => this.mouseDown(limit, ev)}
								onTouchStart={(ev) => this.mouseDown(limit, ev)}
								percentage={limit === ActiveElement.LowerLimit ? this.state.lowerLimit : this.state.upperLimit}
								radius={this.props.handleRadius}
							/>
						)
					}
				</g>
			</svg>
		);
	}

	private getPositionForLimit(pageX: number): { upperLimit?: State['upperLimit'], lowerLimit?: State['lowerLimit']} {
		const rect: ClientRect = this.svgRef.current.getBoundingClientRect()

		if (rect.width > 0) {
			let percentage = (pageX - rect.left) / rect.width;
			if (percentage > 1) {
				percentage = 1
			} else if (percentage < 0) {
				percentage = 0
			}
			const center = (this.state.upperLimit + this.state.lowerLimit) / 2

			if (this.state.activeElement === ActiveElement.Bar) {
				let lowerLimit = percentage + this.state.lowerLimit - center
				let upperLimit = percentage - (center - this.state.upperLimit)
				if (upperLimit >= 1) upperLimit = 1
				if (lowerLimit <= 0) lowerLimit = 0
				return { lowerLimit, upperLimit }
			} else if (this.state.activeElement === ActiveElement.LowerLimit) {
				if (percentage >= this.state.upperLimit) percentage = this.state.upperLimit
				return { lowerLimit: percentage }
			} else if (this.state.activeElement === ActiveElement.UpperLimit) {
				if (percentage <= this.state.lowerLimit) percentage = this.state.lowerLimit
				return { upperLimit: percentage }
			}
		}

		return null;
	}

	private setRange(pageX: number) {
		const posForLim = this.getPositionForLimit(pageX)
		if (posForLim !== null) {
			this.setState(posForLim)
			// this.props.onChange({ ...this.state, refresh: false })
		}
	}

	private mouseDown = (activeElement: ActiveElement, ev: MouseDownEvent) => {
		window.addEventListener('mousemove', this.mouseMove)

		this.mouseState = MouseState.Down
		this.setState({ activeElement })
		return ev.preventDefault()
	}

	private mouseMove = (ev: MouseEvent) => {
		if (this.mouseState === MouseState.Down) {
			this.setRange(ev.pageX)
			return ev.preventDefault()
		}
	}

	private touchMove = (ev: TouchEvent) => {
		if (this.mouseState === MouseState.Down) {
			this.setRange(ev.touches[0].pageX)
			return ev.preventDefault()
		}
	}

	private mouseUp = () => {
		window.removeEventListener('mousemove', this.mouseMove)

		if (this.mouseState === MouseState.Down) {
			this.props.onChange({ ...this.state, refresh: true })
			this.setState({ activeElement: null })
		}
		this.mouseState = MouseState.Up
	}

	private getRangeLine() {
		const { handleRadius: radius, lineWidth } = this.props
		const strokeWidth = lineWidth / 2
		const startX = radius + strokeWidth
		const endX = VIEW_BOX_WIDTH + radius + strokeWidth
		const y = radius + strokeWidth
		return `M${startX} ${y} L ${endX} ${y} Z`
	}

	private getCurrentRangeLine() {
		const { handleRadius: radius, lineWidth } = this.props
		const strokeWidth = lineWidth / 2
		const startX = radius + strokeWidth + Math.floor(this.state.lowerLimit * VIEW_BOX_WIDTH)
		const endX = radius + strokeWidth + Math.ceil(this.state.upperLimit * VIEW_BOX_WIDTH)
		const y = radius + strokeWidth
		return `M${startX} ${y} L ${endX} ${y} Z`
	}
}

export default RangeSlider;
