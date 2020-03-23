import * as React from 'react'
// import ActiveFilter from './active-filter'
import { Button } from '../page-number'
import styled from '@emotion/styled'
import useFilters from './use-filters'
import Details from './details'

const Wrapper = styled.div`
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

interface Props {
	clearActiveFilters: () => void
	clearFullTextInput: () => void
	dispatch: React.Dispatch<FacetsDataReducerAction>
	facetsData: FacetsData
	query: string
}
function ActiveFilters(props: Props) {
	const filters = useFilters(props.facetsData)
	if (!props.query.length && !filters.length) return null

	return (
		<Wrapper
			id="huc-fs-active-filters"
		>
			filters:
			<Details
				clearFullTextInput={props.clearFullTextInput}
				dispatch={props.dispatch}
				filters={filters}
				query={props.query}
			/>
			<Button
				onClick={props.clearActiveFilters}
			>
				clear
			</Button>
		</Wrapper>
	)
}

export default React.memo(ActiveFilters)

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
