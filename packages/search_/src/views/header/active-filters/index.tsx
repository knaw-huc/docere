import React from 'react'
import styled from 'styled-components'

import FacetedSearchContext from '../../../context'
import { Button } from '../page-number'
import useFilters from './use-filters'
import Details from './details'

import SearchContext from '../../../facets-context'

const Wrapper = styled.div`
	grid-column: 1 / span 2;
	line-height: 24px;

	& > * {
		display: inline-block;
	}

	& > ul {
		overflow: hidden;
		width: 100%;
		white-space: nowrap;

		& > li {
			box-sizing: border-box;
			cursor: pointer;
			display: inline-block;
			margin-right: .5em;
			max-width: 100px;
			overflow: hidden;
			text-decoration: underline;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
`

function ActiveFilters() {
	const context = React.useContext(FacetedSearchContext)
	const { state, dispatch } = React.useContext(SearchContext) 
	const filters = useFilters(state.facets)

	const reset = React.useCallback(() => {
		dispatch({ type: 'RESET' })
	}, [])

	if (!state.query.length && !filters.length) return null

	return (
		<Wrapper
			id="huc-fs-active-filters"
		>
			filters:
			<Details
				dispatch={dispatch}
				filters={filters}
				query={state.query}
			/>
			<Button
				onClick={reset}
				spotColor={context.style.spotColor}
			>
				clear
			</Button>
		</Wrapper>
	)
}

export default ActiveFilters

				{/* <ul ref={wrapperRef}>
					{
						filters.map(filter =>
							<ActiveFilter
								dispatch={props.dispatch}
								filter={filter}
								key={filter.id}
							/>
						)
					}
				</ul> */}


// filters = [
//   {
//     "id": "person",
//     "title": "Persons",
//     "values": [
//       "Kantore der registratie",
//       "H. vande Mortie Voor lxtrait conform",
//       "Hendrik van de Mortel",
//       "Daelijk",
//       "August Frans",
//       "Aldus",
//       "Pieter Humerius",
//       "Mosman HZ",
//       "jaors",
//       "vande Nortel"
//     ]
//   },
//   {
//     "id": "daymonthyear",
//     "title": "Daymonthyear",
//     "values": [
//       "twaalfden december achttien honderd zeven en dertig",
//       "twaalfden december achttien honderd zeven en dertig n"
//     ]
//   },
//   {
//     "id": "month",
//     "title": "Month",
//     "values": [
//       "november"
//     ]
//   },
//   {
//     "id": "pre",
//     "title": "Prename",
//     "values": [
//       "Hendrek"
//     ]
//   },
//   {
//     "id": "daymonth",
//     "title": "Daymonth",
//     "values": [
//       "12. december"
//     ]
//   }
// ]


	// const wrapperRef = React.useRef<HTMLUListElement>()
	// const hasOverflow = useHasOverflow(wrapperRef.current, filters)
