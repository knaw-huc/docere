import React from 'react'
import styled from 'styled-components'

import useFilters from './use-filters'
import Details from './details'
import { SearchPropsContext, SearchContext } from '@docere/common'
import { Button } from '../../ui/button'

const Wrapper = styled.div`
	font-size: .8rem;
	line-height: .8rem;

	& > * {
		margin-bottom: 1.5rem;
	}
`

export function ActiveFilters() {
	const { i18n, style } = React.useContext(SearchPropsContext)
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
			<div>
				<Button
					onClick={reset}
					spotColor={style.spotColor}
				>
					{i18n.clear}
				</Button>
			</div>
			<Details
				dispatch={dispatch}
				filters={filters}
				query={state.query}
			/>
		</Wrapper>
	)
}
