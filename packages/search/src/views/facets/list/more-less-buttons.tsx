import * as React from 'react'
import { MoreLessButton } from '../../button'


export default function(props: Pick<ListFacetProps, 'facetData' | 'facetsDataDispatch' | 'values'>) {
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
				<MoreLessButton
					onClick={handleMore}
				>
					{`View more (${props.values.total - props.facetData.viewSize})`}
				</MoreLessButton>
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
