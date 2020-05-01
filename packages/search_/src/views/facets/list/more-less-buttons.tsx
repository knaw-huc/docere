import React from 'react'
import styled from 'styled-components'

import FacetedSearchContext from '../../../context'
import { MoreLessButton } from '../../button'

import type { Props } from './values'
import SearchContext from '../../../facets-context'

const MoreButton = styled(MoreLessButton)`
	margin-right: 1rem;	
`

export default function(props: Props) {
	const context = React.useContext(FacetedSearchContext)
	const searchContext = React.useContext(SearchContext)

	const handleLess = React.useCallback(() => {
		searchContext.dispatch({ type: 'view_less', facetId: props.facetData.config.id })
	}, [props.facetData.config.id, props.values])

	const handleMore = React.useCallback(() => {
		searchContext.dispatch({ type: 'view_more', facetId: props.facetData.config.id, total: props.values.total })
	}, [props.facetData.config.id, props.values.total])

	return (
		<>
			{
				props.values.total > 0 &&
				props.values.total > props.facetData.size &&
				<MoreButton
					onClick={handleMore}
					spotColor={context.style.spotColor}
				>
					{`View more (${props.values.total - props.facetData.size})`}
				</MoreButton>
			}
			{
				props.facetData.size < props.facetData.size &&
				<MoreLessButton
					onClick={handleLess}
					spotColor={context.style.spotColor}
				>
					View less
				</MoreLessButton>
			}
		</>
	)
}
