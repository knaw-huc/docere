import React from "react"
import styled from "styled-components"
import { SearchPropsContext, Tooltip } from "@docere/common"
import { RoundButton } from "./button"

const Wrapper = styled.div`
	align-self: center;
	justify-self: center;
	position: relative;
`

const Body = styled.div`
	font-size: .75rem;
	padding: .5rem;
`

interface Props {
	children: React.ReactNode
	offset?: number
}
export function HelpButton(props: Props) {
	const { style } = React.useContext(SearchPropsContext)
	const [tooltipActive, setTooltipActive] = React.useState(false)

	if (props.children == null) return null

	return (
		<Wrapper
			className="help-button"
			onClick={() => setTooltipActive(!tooltipActive)}
		>
			<RoundButton
				active={tooltipActive}
				spotColor={style.spotColor}
			>
				?
			</RoundButton>
			{
				tooltipActive &&
				<Tooltip
					color={style.spotColor}
					offset={props.offset}
				>
					<Body>
						{props.children}
					</Body>
				</Tooltip>
			}
		</Wrapper>
	)
}
