import React from 'react'
import styled from 'styled-components'

import FacetedSearchContext from '../../context'
import { BACKGROUND_GRAY } from '../../constants'

export const Button = styled.div`
	color: ${(props: { spotColor: string}) => props.spotColor};
	cursor: pointer;
	user-select: none;
`

interface PnProps { active: boolean }
const PageNumberWrapper = styled(Button)`
	background-color: ${(props: PnProps) => props.active ? BACKGROUND_GRAY : 'white'};
	border-radius: .25em;
	color: ${(props: PnProps) => props.active ? '#888' : 'inherit'};
	font-weight: ${(props: PnProps) => props.active ? 'bold' : 'normal'};
	padding: .35em;
	text-align: center;
`

interface Props {
	currentPage: number
	pageNumber: number
	setCurrentPage: () => void
}
function PageNumber(props: Props) {
	const context = React.useContext(FacetedSearchContext)
	const active = props.pageNumber === props.currentPage
	return (
		<PageNumberWrapper
			active={active}
			className={active ? 'active' : null}
			key={props.pageNumber}
			onClick={props.setCurrentPage}
			spotColor={context.style.spotColor}
		>
			{props.pageNumber}
		</PageNumberWrapper>
	)
}

export default React.memo(PageNumber)
