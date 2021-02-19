import { SearchContext, SearchPropsContext } from '@docere/common'
import React from 'react'
import styled from 'styled-components'

import { MoreLessButton } from '../../ui/button'

import type { Props } from './values'

const MoreButton = styled(MoreLessButton)`
	margin-right: 1rem;	
`

export default function(props: Props) {
	const { i18n, style } = React.useContext(SearchPropsContext)
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
					spotColor={style.spotColor}
				>
					{`${i18n.view_more} (${props.values.total - props.facetData.size})`}
				</MoreButton>
			}
			{
				props.facetData.config.size < props.facetData.size &&
				<MoreLessButton
					onClick={handleLess}
					spotColor={style.spotColor}
				>
					{i18n.view_less}
				</MoreLessButton>
			}
		</>
	)
}
