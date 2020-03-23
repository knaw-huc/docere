import * as React from 'react'
import styled from '@emotion/styled'
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
interface State { 
	suggestions: string[]
}
export default class AutoSuggest extends React.PureComponent<Props, State> {
	private cache: {[key: string]: string[]} = {}
	state: State = {
		suggestions: []
	}

	async componentDidUpdate(prevProps: Props, prevState: State) {
		// The update came from a suggestion click
		if (prevState.suggestions.length && !this.state.suggestions.length) return

		if (prevProps.value !== this.props.value) {
			this.requestAutoSuggest()
		}
	}

	render() {
		return (
			<SuggestionsDropDownBody
				show={this.state.suggestions.length > 0}
			>
				{
					this.state.suggestions.map((suggestion, index) =>
						<div
							key={index}
							onClick={() => {
								this.setState({ suggestions: [] })
								this.props.onClick(suggestion)
							}}
						>
							{suggestion}
						</div>
					)
				}
			</SuggestionsDropDownBody>
		)
	}

	private autoSuggest = async () => {
		let suggestions: string[]

		if (this.cache.hasOwnProperty(this.props.value)) {
			suggestions = this.cache[this.props.value]
		} else {
			suggestions = await this.props.autoSuggest(this.props.value)
			this.cache[this.props.value] = suggestions
		}

		this.setState({ suggestions })
	}
	private requestAutoSuggest = debounce(this.autoSuggest, 300)
}
