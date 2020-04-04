import React from 'react'

import FacetedSearchContext from '../../context'
import { Section, ResultList, Result } from './components'

import type { FSResponse } from '@docere/common'

interface Props {
	searchResult: FSResponse
}
function HucSearchResults(props: Props) {
	const context = React.useContext(FacetedSearchContext)
	return (
		<Section id="huc-fs-search-results">
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
		</Section>
	)
}

export default React.memo(HucSearchResults)
