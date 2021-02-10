import { LanguageMap, SPOT_COLOR } from '@docere/common'
import React from 'react'
import styled, { css } from "styled-components"

export const inputStyle = css`
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

const Wrapper = styled.div`
	display: grid;
	grid-template-columns: 32px auto 32px;
	height: 49px;

	& > .search-icon {
		align-self: center;
		fill: #CCC;
		height: 18px;
		width: 18px;
	}

	input {
		${inputStyle}
	}

	button {
		align-self: center;
		background: none;
		border: none;
		color: ${SPOT_COLOR};
		cursor: pointer;
		font-weight: bold;
		height: 1rem;
		justify-self: right;
		padding: 0;
		text-align: center;
		width: 1rem;
	}
`


interface Props {
	handleInputChange: any
	i18n: LanguageMap
	inputValue: string
	setSuggestActive: any
}
export function InputWrapper(props: Props) {
	const handleKeyDown = React.useCallback(ev => {
		if (
			ev.keyCode === 13 || 	// Enter
			ev.keyCode === 27		// Escape
		) {
			props.setSuggestActive(false)
		}
	}, [])

	const handleClose = React.useCallback(() => {
		props.setSuggestActive(false)
		props.handleInputChange({ target: { value: '' }})
	}, [])

	return (
		<Wrapper>
			<div className="search-icon">
				<svg viewBox="0 0 250.313 250.313">
					<path d="M244.186,214.604l-54.379-54.378c-0.289-0.289-0.628-0.491-0.93-0.76 c10.7-16.231,16.945-35.66,16.945-56.554C205.822,46.075,159.747,0,102.911,0S0,46.075,0,102.911 c0,56.835,46.074,102.911,102.91,102.911c20.895,0,40.323-6.245,56.554-16.945c0.269,0.301,0.47,0.64,0.759,0.929l54.38,54.38 c8.169,8.168,21.413,8.168,29.583,0C252.354,236.017,252.354,222.773,244.186,214.604z M102.911,170.146 c-37.134,0-67.236-30.102-67.236-67.235c0-37.134,30.103-67.236,67.236-67.236c37.132,0,67.235,30.103,67.235,67.236 C170.146,140.044,140.043,170.146,102.911,170.146z" />
				</svg>
			</div>
			<input
				type="text"
				onChange={props.handleInputChange}
				onClick={() => props.setSuggestActive(false)}
				onKeyDown={handleKeyDown}
				placeholder={props.i18n.search_documents}
				value={props.inputValue}
			/>
			{
				props.inputValue.length > 0 &&
				<button
					className="close"
					onClick={handleClose}
				>
					✕
				</button>
			}
		</Wrapper>
	)
}
