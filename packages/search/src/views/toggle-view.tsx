import React from "react"
import styled from "styled-components"

const Tabs = styled.div`
	cursor: pointer;
	display: grid;
	grid-template-columns: auto auto;
	font-size: .9rem;
	position: absolute;
	top: 0;
	right: 0;
	height: 2rem;
	left: 0;
	z-index: 1;
`

interface TabProps { active: boolean }
const Tab = styled.div`
	align-content: center;
	background: ${(props: TabProps) => props.active ? 'initial' : '#EEE'};
	box-shadow: ${props => props.active ? 'initial' : '-1px -1px 10px inset #CCC'};
	color: ${props => props.active ? 'initial' : '#666'};
	display: grid;
	height: 100%;
	justify-content: center;
	width: 100%;
`

interface Props {
	setShowResults: (x: boolean) => void
	showResults: boolean
	small: boolean
}
export function ToggleView(props: Props) {
	const toggle = React.useCallback(() => {
		props.setShowResults(!props.showResults)
	}, [props.showResults])

	if (!props.small) return null

	return (
		<Tabs
			onClick={toggle}
		>
			<Tab active={!props.showResults}>filters</Tab>
			<Tab active={props.showResults}>results</Tab>
		</Tabs>
	)
}
