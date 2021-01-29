import React from 'react'
import styled from 'styled-components'

import { FacetInfoButton, FacetMenuButton } from '../button'

import { FacetData, SearchPropsContext } from '@docere/common'

const Header = styled('header')`
	display: grid;
	grid-template-columns: fit-content(0) 24px 24px auto;
	& > button {
		margin-left: .2rem;
	}
`

type HProps = Pick<Props, 'collapse'> & { spotColor: string }
const H3 = styled('h3')`
	cursor: pointer;
	display: inline-block;
	font-size: 1rem;
	margin: 0 .33rem .5rem 0;
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

const Description = styled.div`
	color: #666;
	font-size: .9rem;
	font-style: italic;
	grid-column: 1 / -1;
	margin-bottom: 1.25rem;
	margin-top: -.25rem;
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
	const [showDescription, setShowDescription] = React.useState(false)
	const [showOptions, setShowOptions] = React.useState(false)
	
	const toggleOptions = React.useCallback(() => {
		setShowOptions(!showOptions)
	}, [showOptions])

	const toggleDescription = React.useCallback(() => {
		setShowDescription(!showDescription)
	}, [showDescription])

	React.useEffect(() => {
		if (props.collapse) {
			setShowOptions(false)
			setShowDescription(false)
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
			</H3>
			{
				props.facetData.config.description != null &&
				<FacetInfoButton
					active={showDescription}
					onClick={toggleDescription}
					spotColor={style.spotColor}
				>
					<svg
						viewBox="0 0 256 256"
						width="16px"
						height="16px"
					>
						<path
							d="m128 22.158a105.84 105.84 0 0 0 -105.84 105.84 105.84 105.84 0 0 0 105.84 105.84 105.84 105.84 0 0 0 105.84 -105.84 105.84 105.84 0 0 0 -105.84 -105.84zm0 32.76c5.16 0.117 9.55 1.875 13.18 5.273 3.34 3.575 5.07 7.94 5.19 13.096-0.12 5.156-1.85 9.404-5.19 12.744-3.63 3.75-8.02 5.625-13.18 5.625s-9.4-1.875-12.74-5.625c-3.75-3.34-5.63-7.588-5.63-12.744s1.88-9.521 5.63-13.096c3.34-3.398 7.58-5.156 12.74-5.273zm-16.35 53.792h32.79v92.37h-32.79v-92.37z"
							fill={style.spotColor}
						/>
					</svg>
				</FacetInfoButton>
			}
			{
				!props.collapse &&
				props.hasOptions &&
				<FacetMenuButton
					active={showOptions}
					onClick={toggleOptions}
					spotColor={style.spotColor}
				>
					<svg
						viewBox="0 0 21.589 21.589"
						width="12px"
						height="12px"
						fill={style.spotColor}
					>
						<path d="M18.622,8.371l-0.545-1.295c0,0,1.268-2.861,1.156-2.971l-1.679-1.639c-0.116-0.113-2.978,1.193-2.978,1.193l-1.32-0.533
							c0,0-1.166-2.9-1.326-2.9H9.561c-0.165,0-1.244,2.906-1.244,2.906L6.999,3.667c0,0-2.922-1.242-3.034-1.131L2.289,4.177
							C2.173,4.29,3.507,7.093,3.507,7.093L2.962,8.386c0,0-2.962,1.141-2.962,1.295v2.322c0,0.162,2.969,1.219,2.969,1.219l0.545,1.291
							c0,0-1.268,2.859-1.157,2.969l1.678,1.643c0.114,0.111,2.977-1.195,2.977-1.195l1.321,0.535c0,0,1.166,2.898,1.327,2.898h2.369
							c0.164,0,1.244-2.906,1.244-2.906l1.322-0.535c0,0,2.916,1.242,3.029,1.133l1.678-1.641c0.117-0.115-1.22-2.916-1.22-2.916
							l0.544-1.293c0,0,2.963-1.143,2.963-1.299v-2.32C21.59,9.425,18.622,8.371,18.622,8.371z M14.256,10.794
							c0,1.867-1.553,3.387-3.461,3.387c-1.906,0-3.461-1.52-3.461-3.387s1.555-3.385,3.461-3.385
							C12.704,7.41,14.256,8.927,14.256,10.794z"
						/>
					</svg>
				</FacetMenuButton>
			}
			{
				showDescription &&
				<Description>{props.facetData.config.description}</Description>
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
