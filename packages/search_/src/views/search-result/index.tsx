import React from 'react'
import { Section, ResultList, Result } from './components'
import type { AppProps, FSResponse } from '@docere/common'

type Props = Pick<AppProps, 'onClickResult' | 'ResultBodyComponent' | 'resultBodyProps'> & {
	searchResult: FSResponse
}

function HucSearchResults(props: Props) {
	return (
		<Section id="huc-fs-search-results">
			<ResultList>
				{
					props.searchResult.results.map((hit, i) =>
						<Result
							key={i}
							onClick={(ev) => {
								if (props.onClickResult != null) props.onClickResult(hit, ev)
							}}
						>
							<props.ResultBodyComponent
								{...props.resultBodyProps}
								result={hit}
							/>
						</Result>
					)
				}
			</ResultList>
			{/* <Pagination
				currentPage={props.currentPage}
				resultsPerPage={props.resultsPerPage}
				searchResults={props.searchResult}
				setCurrentPage={props.setCurrentPage}
			/> */}
		</Section>
	)
}

export default React.memo(HucSearchResults)
