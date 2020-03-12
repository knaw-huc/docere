import * as React from 'react'
import styled from 'styled-components'
import { SearchTab, Colors } from '@docere/common'
// import { DEFAULT_SPACING, MAINHEADER_HEIGHT } from '../constants'
// import Tooltip from './tooltip'

interface WProps {
	active: boolean
	hasFacsimile: boolean
	small: boolean
}
const Wrapper = styled.div`
	border-bottom: 1px solid #EEE;
	display: grid;
	font-size: ${(props: WProps) => props.small ? '.8em' : '1em'};
	grid-column-gap: ${(props: WProps) => props.small ? 32 / 2 : 32}px;
	grid-template-columns: ${(props: WProps) => props.hasFacsimile ?
		`${props.small ? '64px 0' : '128px auto'}` :
		'auto'
	};
	padding: 1.5em 0;

	&:before {
		content: '';
		position: absolute;
		width: 6px;
		top: 0;
		bottom: 0;
		background: rgba(199, 170, 113, 0);
		left: -18px;
	}

	${(props: WProps) => {
		if (props.active) {
			return `
				cursor: default;

				&:before {
					background: ${Colors.BrownLight};
				}
			`
		} else {
			return `
				&:hover:before {
					background: rgba(199, 170, 113, .33);
				}
			 `
		}
	}}
`

const Snippets = styled.ul`
	color: #444;
	font-size: .66em;	
	grid-column: 1 / span 3;
	margin-top: 1em;

	em {
		color: black;
		font-weight: bold;
	}
`

const FacsimileThumbList = styled.ul`
	& > li:nth-of-type(odd) {
		margin-right: 8px;
	}
`

const FacsimileThumb = styled.li`
	display: inline-block;
	margin-bottom: 8px;

	& > img {
		border-radius: .15em;
	}
`

function FacsimileThumbs(props: { facsimiles: string[], small: boolean }) {
	if (props.facsimiles == null || !props.facsimiles.length) return null
	const thumbWidth = props.small ? 64 : 128
	return props.facsimiles.length === 1 ?
		<img
			src={props.facsimiles[0].replace('info.json', `full/${thumbWidth},/0/default.jpg`)}
			width={`${thumbWidth}px`}
		/> :
		<FacsimileThumbList>
			{
				props.facsimiles.map(facs => 
					<FacsimileThumb key={facs}>
						<img
							src={facs.replace('info.json', `full/${(thumbWidth - 8)/2},/0/default.jpg`)} 
							width={`${(thumbWidth - 8)/2}px`}
						/>
					</FacsimileThumb>
				)
			}
		</FacsimileThumbList>
}

// TODO there are two implementations of ResultBodyProps
// interface State {
// 	// active: boolean
// 	tooltipTop: number
// }

function ResultBody(props: DocereResultBodyProps) {
	// const [active, setActive] = React.useState(false)
	// const [tooltipTop, setTooltipTop] = React.useState(0)
	const small = props.searchTab === SearchTab.Results

	return (
		<Wrapper
			active={props.result.id === props.activeId}
			hasFacsimile={props.result.hasOwnProperty('facsimiles') && props.result.facsimiles.length > 0}
			// onMouseEnter={(ev) => {
				// const top = ev.currentTarget.getBoundingClientRect().top - MAINHEADER_HEIGHT - 32
				// setActive(true)
				// setTooltipTop(top)
			// }}
			// onMouseLeave={() => setActive(false)}
			small={small}
		>
			<FacsimileThumbs
				facsimiles={props.result.facsimiles}
				small={small}
			/>
			{
				// small ?
				// 	<Tooltip
				// 		orientation="right"
				// 		style={{
				// 			width: '360px',
				// 			display: active ? 'block' : 'none',
				// 			top: `${tooltipTop}px`,
				// 		}}
				// 		bodyStyle={{ 
				// 			backgroundColor: '#212830',
				// 			color: '#EEE',
				// 		}}
				// 		shift={.15}
				// 	>
				// 		{props.children}
				// 	</Tooltip> :
					<div>{props.children}</div>
			}
			{
				props.result.snippets.length > 0 &&
				<Snippets>
					{props.result.snippets.map((snippet, index) =>
						<li dangerouslySetInnerHTML={{ __html: `...${snippet}...` }}  key={index} />
					)}
				</Snippets>
			}
		</Wrapper>
	)
}

export default React.memo(ResultBody)
