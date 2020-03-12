import * as React from 'react'
import styled from '@emotion/styled'

const Img = styled.img`
	position: absolute;
	left: 0;
	width: 32px;
`
function div(props: any & { facs: string, children: any }) {
	const src = `http://localhost:5004/abeltasman/${props.facs}/full/,32/0/default.jpg`
	return (
		<div>
			<Img
				onClick={() => {
					// Use the attr provided by extractedFacsimileData to retrieve the ID of the current element
					const id = props[props.extractedFacsimileData.attr]
					// With the ID find the associated path
					const facsimile = props.extractedFacsimileData.facsimiles.find((facs: ExtractedFacsimile) => facs.id === id)
					props.setState({ facsimiles: [facsimile] })
				}}
				src={src}
			/>
			{props.children}
		</div>
	)
}

const components: any = {
	pb: div
}

export default components
