import React from 'react'
import styled from "styled-components"

import FacetHeader from './header'

interface WP { collapse: boolean }
const Wrapper = styled.div`
	color: #444;
	margin-bottom: ${(p: WP) => p.collapse ? 0 : '2rem'};
	margin-top: ${(p: WP) => p.collapse ? 0 : '1rem'};
	position: relative;
	transition: margin 100ms;
`

type FacetProps = any
interface Props {
	children: React.ReactNode
	className?: string
	facetProps: FacetProps
	Options?: React.FC<FacetProps>
}
function Facet(props: Props) {
	const [collapse, setCollapse] = React.useState(false)
	const [showOptions, setShowOptions] = React.useState(false)
	
	const toggleOptions = React.useCallback(() => {
		setCollapse(false)
		setShowOptions(!showOptions)
	}, [showOptions])

	const toggleCollapse = React.useCallback(() => {
		setCollapse(!collapse)
	}, [collapse])

	return (
		<Wrapper
			className={props.className}
			collapse={collapse}
		>
			<FacetHeader
				collapse={collapse}
				facetData={props.facetProps.facetData}
				hasOptions={props.Options != null}
				toggleCollapse={toggleCollapse}
				toggleOptions={toggleOptions}
			/>
			{
				!collapse &&
				showOptions &&
				props.Options != null &&
				<props.Options {...props.facetProps} />
			}
			{
				!collapse &&
				props.children
			}
		</Wrapper>
	)
}

export default React.memo(Facet)
