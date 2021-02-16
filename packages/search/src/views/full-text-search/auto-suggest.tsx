import React from 'react'
import styled from 'styled-components'
import debounce from 'lodash.debounce'

import { DropDownBody } from '../ui/drop-down'

const SuggestionsDropDownBody = styled(DropDownBody)`
	border-top: 0;
	margin-top: 1px;
`

interface Props {
	autoSuggest: (query: string) => Promise<string[]>
	onClick: (query: string) => void
	value: string
}

const cache: {[key: string]: string[]} = {}

export function AutoSuggest(props: Props) {
	const [suggestions, setSuggestions] = useSuggestions(props)

	return (
		<SuggestionsDropDownBody
			show={suggestions.length > 0}
		>
			{
				suggestions.map((suggestion, index) =>
					<div
						key={index}
						onClick={() => {
							setSuggestions([])
							props.onClick(suggestion)
						}}
					>
						{suggestion}
					</div>
				)
			}
		</SuggestionsDropDownBody>
	)
}


function useSuggestions(props: Props): [string[], React.Dispatch<string[]>] {
	const [suggestions, setSuggestions] = React.useState<string[]>([])

	/**
	 * Debounced callback function for updating the suggestions.
	 * 
	 * When the user types in the input value, the autoSuggest function
	 * is not fired on every keyDown, but calls autoSuggest with the
	 * combined keyDowns 300ms after the last keyDown event
	 */ 
	const updateSuggestions = React.useCallback(
		debounce(
			value => {
				if (cache.hasOwnProperty(value)) {
					setSuggestions(cache[value])
				} else {
					props.autoSuggest(value)
						.then(suggestions => {
							// If there is only one suggestions which is equal
							// to the input value, show nothing.
							if (
								suggestions.length === 1 &&
								suggestions[0].toLowerCase() === value.toLowerCase()
							) {
								suggestions = []
							}

							cache[value] = suggestions
							setSuggestions(suggestions)
						})
				}
			},
			300
		),
		[]
	)

	// Update the suggestions whenever the input value changes
	React.useEffect(() => {
		updateSuggestions(props.value)
	}, [props.value])

	return [suggestions, setSuggestions]
}


// interface State { 
// 	suggestions: string[]
// }
// export default class AutoSuggest extends React.PureComponent<Props, State> {
// 	private cache: {[key: string]: string[]} = {}
// 	state: State = {
// 		suggestions: []
// 	}

// 	async componentDidUpdate(prevProps: Props, prevState: State) {
// 		// The update came from a suggestion click
// 		if (prevState.suggestions.length && !this.state.suggestions.length) return

// 		if (prevProps.value !== this.props.value) {
// 			this.requestAutoSuggest()
// 		}
// 	}

// 	render() {
// 		return (
// 			<SuggestionsDropDownBody
// 				show={this.state.suggestions.length > 0}
// 			>
// 				{
// 					this.state.suggestions.map((suggestion, index) =>
// 						<div
// 							key={index}
// 							onClick={() => {
// 								this.setState({ suggestions: [] })
// 								this.props.onClick(suggestion)
// 							}}
// 						>
// 							{suggestion}
// 						</div>
// 					)
// 				}
// 			</SuggestionsDropDownBody>
// 		)
// 	}

// 	private autoSuggest = async () => {
// 		let suggestions: string[]

// 		if (this.cache.hasOwnProperty(this.props.value)) {
// 			suggestions = this.cache[this.props.value]
// 		} else {
// 			suggestions = await this.props.autoSuggest(this.props.value)
// 			this.cache[this.props.value] = suggestions
// 		}

// 		/**
// 		 * If there is only one suggestions which is equal to the input value,
// 		 * show nothing.
// 		 */
// 		if (
// 			suggestions.length === 1 &&
// 			suggestions[0].toLowerCase() === this.props.value.toLowerCase()
// 		) {
// 			suggestions = []
// 		}

// 		this.setState({ suggestions })
// 	}
// 	private requestAutoSuggest = debounce(this.autoSuggest, 300)
// }
