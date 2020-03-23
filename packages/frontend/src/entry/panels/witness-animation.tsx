import * as React from 'react'
import DocereTextView from '../../../../text/src/index'
import styled from '@emotion/styled'
import { TEXT_PANEL_WIDTH } from '../../constants'
import { Text } from './text'
import AppContext from '../../app-context'

const Wrapper = styled.div`
	grid-template-rows: auto 50px;
	height: 100%;
`

// TODO merge with TextWrapper from index.components.tsx?
const TextWrapper = styled.div`
	display: grid;
	grid-template-columns: auto ${TEXT_PANEL_WIDTH}px auto;
	height: calc(100% - 50px);
	overflow-y: auto;
`

const Controls = styled.div`
	background: black;
	color: white;
	height: 50px;
`

const Markers = styled.ul`
	display: grid;
	grid-template-columns: ${(props: { count: number }) => `repeat(${props.count + 1}, 1fr);`}
`

const Marker = styled.li`
	background: ${(props: any) => props.active ? 'white' : 'gray'};
	cursor: pointer;
	display: inline-block;
	height: 25px;
	justify-self: right;
	margin-top: 4px;
	width: ${(props: any) => props.active ? 12 : 4}px;
`

interface State {
	components: DocereComponents
	textLayer: Layer
	prevTextLayer: Layer
	textLayers: Layer[]
}
export default class WitnessAnimationPanel extends React.PureComponent<WitnessAnimationPanelProps, State> {
	private textRef: React.RefObject<HTMLDivElement>
	private interval: any

	// TODO move to constructor
	state: State = {
		components: {},
		prevTextLayer: null,
		textLayer: this.props.entry.textLayers.filter(tl => tl.type === LayerType.Text)[0],
		textLayers: this.props.entry.textLayers.filter(tl => tl.type === LayerType.Text)
	}

	componentDidMount() {
		// TODO set components
		// this.context.getComponents(DocereComponentContainer.Layer)
		// 	.then(components => this.setState({ components }))
		let i = 0
		this.interval = setInterval(() => {
			if (i < this.state.textLayers.length) {
				this.setActiveTextLayer(this.state.textLayers[i].id)
			} else {
				clearInterval(this.interval)
			}
			i++
		}, 4000)
	}

	render() {
		return (
			<Wrapper>
				<TextWrapper>
					<Text 
						hasFacs={this.props.configData.extractFacsimiles != null}
						ref={this.textRef}
					>
						{/* TODO customProps should be of type DocereComponentProps */}
						<DocereTextView
							customProps={{
								prevTextLayer: this.state.prevTextLayer?.id,
								textLayer: this.state.textLayer.id
							}}
							components={this.state.components}
							node={this.props.entry.textLayers[3].element}
						/>
					</Text>
				</TextWrapper>
				<Controls>
					<Markers count={this.state.textLayers.length}>
						{
							this.state.textLayers.map((tl, index) => 
								<Marker
									active={this.state.textLayer.id === tl.id}
									key={index}
									onClick={() => {
										this.setActiveTextLayer(tl.id)
									}}
								/>
							)
						}
					</Markers>
				</Controls>
			</Wrapper>
		)
	}

	private setActiveTextLayer(textLayerId: string) {
		const index = this.state.textLayers.findIndex(tl => tl.id === textLayerId)
		const textLayer = this.state.textLayers[index]
		const firstFacs = this.props.entry.facsimiles.find(f => f.id === `${textLayer.id}-1`.toLowerCase())
		if (firstFacs) this.props.dispatch({ type: 'SET_ACTIVE_FACSIMILE_PATH', src: firstFacs.path[0] })
		this.setState({
			prevTextLayer: this.state.textLayers[index - 1],
			textLayer
		})
	}
}

WitnessAnimationPanel.contextType = AppContext

