import React from 'react'

import { Section, ResultList, Result } from './components'

import { FacetedSearchProps, FSResponse, SearchContext, SearchPropsContext } from '@docere/common'
// import useFilters from '../header/active-filters/use-filters'

interface Props {
	SearchHomeComponent: FacetedSearchProps['SearchHomeComponent']
	searchResult: FSResponse
}
function HucSearchResults(props: Props) {
	const context = React.useContext(SearchPropsContext)
	const { state } = React.useContext(SearchContext) 

	return (
		<Section id="huc-fs-search-results">
			{
				props.SearchHomeComponent != null && !state.isActive ?
					<props.SearchHomeComponent /> :
					<ResultList>
						{
							props.searchResult.results.map((hit, i) =>
								<Result
									key={i}
									onClick={(ev) => {
										if (context.onClickResult != null) context.onClickResult(hit, ev)
									}}
								>
									<context.ResultBodyComponent
										{...context.resultBodyProps}
										result={hit}
									/>
								</Result>
							)
						}
					</ResultList>
			}
		</Section>
	)
}

export default React.memo(HucSearchResults)
