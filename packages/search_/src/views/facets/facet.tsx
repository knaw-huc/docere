import React from 'react'
import styled from "styled-components"

import FacetHeader from './header'
import { FacetData } from '@docere/common'

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
	Options?: React.FC<{ facetData: FacetData }>
}
function Facet(props: Props) {
	const [collapse, setCollapse] = React.useState(false)

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
				Options={props.Options}
				toggleCollapse={toggleCollapse}
			/>
			{
				!collapse &&
				props.children
			}
		</Wrapper>
	)
}

export default React.memo(Facet)
