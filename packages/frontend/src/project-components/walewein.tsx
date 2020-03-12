import * as React from 'react'
import { lb, hi } from "./index"
import styled from '@emotion/styled'

const StyledNote = styled.span`
	cursor: pointer;
	display: inline-block;
    border-radius: 20px;
    border: 1px solid #AAA;
	box-sizing: border-box;
	color: #666;
    font-size: 0.7em;
    line-height: 18px;
    margin: 0 4px;
    min-width: 18px;
    padding: 0 6px;
	text-align: center;
	transition-property: color, background-color;
	transition-duration: 350ms;
	vertical-align: text-top;
	
	&:hover {
		color: white;
		background-color: #AAA;
	}

	&:after {
		counter-increment: notenumber;
		content: counter(notenumber);
	}
`

function note() {
	return <StyledNote />
}

const Img = styled.img`
	cursor: pointer;
	position: absolute;
	left: 0;
	width: 32px;
`
function text(props: any) {
	const src = `http://localhost:5004/walewein/${props.facspath}/full/,32/0/default.jpg`
	return (
		<div>
			<span onClick={() => props.setState({ facsimiles: [{
				id: `http://localhost:5004/walewein/${props.facspath}/info.json`, 
				path: `http://localhost:5004/walewein/${props.facspath}/info.json`, 
			}] })}>
				<Img src={src} />
			</span>
			{props.children}
		</div>
	)
}

export default { hi, lb, note, text }