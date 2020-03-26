import * as React from 'react'
import styled from 'styled-components'
import AutoSuggest from './auto-suggest'
import debounce from 'lodash.debounce'

export const Wrapper = styled.div`
	align-self: end;
	background-color: white;
	border-bottom: 2px solid #CCC;
	box-sizing: border-box;
	position: sticky;
	top: 0;
	z-index: 1;

	& > .input {
		display: grid;
		grid-template-columns: 32px auto;
		height: 49px;

		& > .search-icon {
			align-self: center;
			fill: #CCC;
			height: 18px;
			width: 18px;
		}
	}

	#loader {
		background: linear-gradient(to right, white 0%, #AAA 80%, white 100%);
		grid-column: 1 / span 2;
		height: 3px;
		position: absolute;
		width: 0;
	}
`
export const Input = styled.input`
	border: none;
	box-sizing: border-box;
	font-size: 1.2em;
	height: 48px;
	outline: none;
	width: 100%;

	&::placeholder {
		color: #DDD;
		font-style: italic;
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


interface Props {
	autoSuggest: (query: string) => Promise<string[]>
	query: string
	setQuery: (query: string) => void
}
function FullTextSearch(props: Props) {
	const loaderRef = React.useRef()
	const [suggestActive, setSuggestActive] = React.useState(false)
	const [inputValue, setInputValue] = React.useState('')
	const setQuery = debounce(
		(value: string) => {
			props.setQuery(value)
			hideLoader(loaderRef)
		},
		1000
	)
	const handleInputChange = React.useCallback(
		(ev: React.ChangeEvent<HTMLInputElement>) => {
			setSuggestActive(props.autoSuggest != null) // Set suggestActive state only to true if props.autoSuggest exists
			setInputValue(ev.target.value)
			setQuery(ev.target.value)
			showLoader(loaderRef)
		},
		[]
	)

	React.useEffect(() => {
		if (props.query !== inputValue) setInputValue(props.query) 
	}, [props.query])

	return (
		<Wrapper id="huc-full-text-search">
			<div className="input">
				<div className="search-icon">
					<svg viewBox="0 0 250.313 250.313">
						<path d="M244.186,214.604l-54.379-54.378c-0.289-0.289-0.628-0.491-0.93-0.76 c10.7-16.231,16.945-35.66,16.945-56.554C205.822,46.075,159.747,0,102.911,0S0,46.075,0,102.911 c0,56.835,46.074,102.911,102.91,102.911c20.895,0,40.323-6.245,56.554-16.945c0.269,0.301,0.47,0.64,0.759,0.929l54.38,54.38 c8.169,8.168,21.413,8.168,29.583,0C252.354,236.017,252.354,222.773,244.186,214.604z M102.911,170.146 c-37.134,0-67.236-30.102-67.236-67.235c0-37.134,30.103-67.236,67.236-67.236c37.132,0,67.235,30.103,67.235,67.236 C170.146,140.044,140.043,170.146,102.911,170.146z" />
					</svg>
				</div>
				<Input
					type="text"
					onChange={handleInputChange}
					onClick={() => setSuggestActive(false)}
					placeholder="search documents"
					value={inputValue}
				/>
			</div>
			{
				suggestActive &&
				<AutoSuggest
					autoSuggest={props.autoSuggest}
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

export default React.memo(FullTextSearch)
