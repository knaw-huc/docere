import * as React from 'react'
import styled from 'styled-components'

const Header = styled('header')`
	display: grid;
	grid-template-columns: 2fr 1fr;
`

const H3 = styled('h3')`
	color: #444;
	font-size: 1rem;
	margin: 0 0 .5em 0;
`

interface Props {
	children?: React.ReactNode
	facetData: FacetData
}
function FacetHeader(props: Props) {
	const [focus, setFocus] = React.useState(false)
	const title = props.facetData.title || props.facetData.id.charAt(0).toUpperCase() + props.facetData.id.slice(1)

	return (
		<Header
			onMouseEnter={() => setFocus(true)}
			onMouseLeave={() => setFocus(false)}
		>
			<H3>{title}</H3>
			{ focus && props.children }
		</Header>
	)
}

export default React.memo(FacetHeader)
