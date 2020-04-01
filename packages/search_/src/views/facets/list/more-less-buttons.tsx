import React from 'react'
import styled from 'styled-components'

import { MoreLessButton } from '../../button'

import type { Props } from './values'

const MoreButton = styled(MoreLessButton)`
	margin-right: 1rem;	
`

export default function(props: Props) {
	const handleLess = React.useCallback(() => {
		props.facetsDataDispatch({ type: 'view_less', facetId: props.facetData.id })
	}, [props.facetData.id, props.values])

	const handleMore = React.useCallback(() => {
		props.facetsDataDispatch({ type: 'view_more', facetId: props.facetData.id, total: props.values.total })
	}, [props.facetData.id, props.values.total])

	return (
		<>
			{
				props.values.total > 0 &&
				props.values.total > props.facetData.viewSize &&
				<MoreButton
					onClick={handleMore}
				>
					{`View more (${props.values.total - props.facetData.viewSize})`}
				</MoreButton>
			}
			{
				props.facetData.size < props.facetData.viewSize &&
				<MoreLessButton
					onClick={handleLess}
				>
					View less
				</MoreLessButton>
			}
		</>
	)
}
