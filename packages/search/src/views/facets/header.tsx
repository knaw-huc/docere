import React from 'react'
import styled from 'styled-components'

import { FacetData, FacetFilter, SearchPropsContext } from '@docere/common'
import { HelpButton } from '../ui/help-button'
import { SvgButton } from '../ui/button'

const Header = styled('header')`
	align-items: center;
	display: grid;
	grid-template-columns: fit-content(0) 24px 24px auto;

	.more-button, .help-button {
		height: 20px;
		margin-left: .75rem;
	}
`

type HProps = Pick<Props, 'collapse'> & { spotColor: string }
const H3 = styled('h3')`
	cursor: pointer;
	display: inline-block;
	font-size: 1rem;
	margin: 1rem 0;
	user-select: none;
	white-space: nowrap;

	&:before {
		color: ${props => props.spotColor};
		content: '<';
		font-size: 0.5rem;
		line-height: 1rem;
		margin-left: -.9rem;
		position: absolute;
		transform: rotate(${(p: HProps) => p.collapse ? -90 : 90}deg) scale(0.75, 2) translateY(${(p: HProps) => p.collapse ? -2 : 0}px);
	}
`

interface Props {
	collapse: boolean
	facetData: FacetData
	hasOptions: boolean
	Options?: React.FC<{ facetData: FacetData }>
	toggleCollapse: () => void
}
function FacetHeader(props: Props) {
	const { style } = React.useContext(SearchPropsContext)
	const [showOptions, setShowOptions] = React.useState(false)
	
	const toggleOptions = React.useCallback(() => {
		setShowOptions(!showOptions)
	}, [showOptions])

	React.useEffect(() => {
		if (props.collapse) {
			setShowOptions(false)
		}
	}, [props.collapse])

	return (
		<Header>
			<H3
				collapse={props.collapse}
				onClick={props.toggleCollapse}
				spotColor={style.spotColor}
			>
				{props.facetData.config.title}
				{
					props.collapse &&
					<ActiveIndicator filters={props.facetData.filters} />
				}
			</H3>
			<HelpButton
				offset={73}
			>
				{props.facetData.config.facet.description}
			</HelpButton>
			{
				!props.collapse &&
				props.hasOptions &&
				<SvgButton
					active={showOptions}
					className="more-button"
				 	onClick={toggleOptions}
					spotColor={style.spotColor}
				>
					<rect x="15" y="9" width ="2" height="14" /> 
					<rect x="9" y="15" width ="14" height="2" /> 
				</SvgButton>
				// <MoreButton
				// 	active={showOptions}
				// 	className="more-button"
				// 	onClick={toggleOptions}
				// 	spotColor={style.spotColor}
				// >
				// 	<div>+</div>
				// </MoreButton>
			}
			{
				showOptions &&
				props.Options != null &&
				<props.Options facetData={props.facetData} />
			}
		</Header>
	)
}

export default React.memo(FacetHeader)

const Small = styled.small`
	font-weight: normal;
	margin-left: .5rem;
	font-size: .7rem;
	color: #888;
`
function ActiveIndicator(props: { filters: FacetFilter }) {
	const { i18n } = React.useContext(SearchPropsContext)

	const size = Array.isArray(props.filters) ?
		props.filters.length :
		props.filters.size

	if (size === 0) return null

	return (
		<Small>
			{size} {i18n.active}
		</Small>
	)
}
