// import * as React from 'react'
// import { ItemInText, small } from '../entry/index.components'
// import styled from '@emotion/styled';
// import { ID_ATTRIBUTE_NAME } from '../entry'

// const Wrapper = styled.div`
// 	margin-bottom: 2em;
// `

// const H2 = styled.h2`
// 	cursor: pointer;
// 	margin: 0;
// 	margin-bottom: .5em;

// 	& small {
// 		${small}
// 	}
// `

// interface Props {
// 	activeId: string
// 	extractor: Extractor
// 	onClick: (activeId: string) => void
// }
// interface State {
// 	active: boolean
// }
// export default class ExtractedItems extends React.Component<Props, State> {
// 	state: State = {
// 		active: false
// 	}

// 	componentDidUpdate() {
// 		if (!this.state.active) {
// 			const activeItem = this.props.extractor.items.find(item => item.node.attributes[ID_ATTRIBUTE_NAME] === this.props.activeId)
// 			if (activeItem != null) {
// 				this.setState({ active: true })
// 			}
// 		}
// 	}

// 	render() {
// 		return (
// 			<Wrapper>
// 				<H2 onClick={() => this.setState({ active: !this.state.active })}>
// 					{this.props.extractor.title}
// 					{
// 						!this.state.active &&
// 						<small>({this.props.extractor.items.length})</small>
// 					}
// 				</H2>
// 				{
// 					this.state.active &&
// 					<ul>
// 						{
// 							Array.isArray(this.props.extractor.items) &&
// 							this.props.extractor.items.map((item, index) =>
// 								<ItemInText
// 									active={this.props.activeId === item.node.attributes[ID_ATTRIBUTE_NAME]}
// 									count={item.count}
// 									key={index}
// 									node={item.node}
// 									onClick={() => this.props.onClick(item.node.attributes[ID_ATTRIBUTE_NAME])}
// 								>
// 									{item.id}
// 								</ItemInText>
// 							)
// 						}
// 					</ul>
// 				}
// 			</Wrapper>
// 		)
// 	}
// }