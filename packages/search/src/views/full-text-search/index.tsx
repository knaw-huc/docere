import React from 'react'
import styled from 'styled-components'
import debounce from 'lodash.debounce'
import AutoSuggest from './auto-suggest'
import { SearchContext, SearchPropsContext } from '@docere/common'
import { InputWrapper } from './input'

export * from './input'

export const Wrapper = styled.div`
	align-self: end;
	background-color: white;
	border-bottom: 2px solid #CCC;
	box-sizing: border-box;
	position: sticky;
	top: 0;
	z-index: 1;

	#loader {
		background: linear-gradient(to right, white 0%, #AAA 80%, white 100%);
		grid-column: 1 / span 2;
		height: 3px;
		position: absolute;
		width: 0;
	}
`

let loaderIntervalID: number
let loaderIntervalProgress = 0
function showLoader(loaderRef: any) {
	clearInterval(loaderIntervalID)
	loaderIntervalProgress = 0
	loaderIntervalID = window.setInterval(() => {
		loaderIntervalProgress += 25
		const perc = loaderIntervalProgress / 1050
		loaderRef.current.style.width = `${perc * 100}%`
	}, 25)
}

function hideLoader(loaderRef: any) {
	clearInterval(loaderIntervalID)
	loaderIntervalProgress = 0
	loaderRef.current.style.width = '0'
}

export function FullTextSearch() {
	const context = React.useContext(SearchPropsContext)
	const searchContext = React.useContext(SearchContext)
	const loaderRef = React.useRef()
	const [suggestActive, setSuggestActive] = React.useState(false)
	const [inputValue, setInputValue] = React.useState('')
	const setQuery = debounce(
		(value: string) => {
			// props.setQuery(value)
			searchContext.dispatch({ type: 'SET_QUERY', value })
			hideLoader(loaderRef)
		},
		1000
	)
	const handleInputChange = React.useCallback(
		(ev: React.ChangeEvent<HTMLInputElement>) => {
			setSuggestActive(context.autoSuggest != null) // Set suggestActive state only to true if props.autoSuggest exists
			setInputValue(ev.target.value)
			setQuery(ev.target.value)
			showLoader(loaderRef)
		},
		[]
	)

	React.useEffect(() => {
		if (searchContext.state.query !== inputValue) setInputValue(searchContext.state.query) 
	}, [searchContext.state.query])

	return (
		<Wrapper id="huc-full-text-search">
			<InputWrapper
				handleInputChange={handleInputChange}
				i18n={context.i18n}
				inputValue={inputValue}
				setSuggestActive={setSuggestActive}
			/>
			{
				suggestActive &&
				<AutoSuggest
					autoSuggest={context.autoSuggest}
					onClick={query => {
						setInputValue(query)
						setQuery(query)
					}}
					value={inputValue}
				/>	
			}
			<div id="loader" ref={loaderRef} />
		</Wrapper>
	)
}
