import * as React from 'react'
import styled from "@emotion/styled";
import { ASIDE_HANDLE_HEIGHT, ASIDE_HANDLE_WIDTH, TabPosition, SearchTab, FooterTab, AsideTab, Colors } from '@docere/common';
// import icons from './icons'

export const Wrapper = styled.ul`
	align-self: center;
	justify-self: center;
	cursor: pointer;
	line-height: ${(props: WProps) => props.position === TabPosition.Bottom ? ASIDE_HANDLE_WIDTH : ASIDE_HANDLE_HEIGHT}px;
	text-align: center;
	user-select: none;
	width: ${props => props.position === TabPosition.Bottom ? 'auto' : ASIDE_HANDLE_WIDTH}px;

	& > li {
		${props => {
			if (props.position === TabPosition.Right) {
				return `
					border-top-left-radius: 8px;
					border-bottom-left-radius: 8px;
				`
			}
			else if (props.position === TabPosition.Left) {
				return `
					border-bottom-right-radius: 8px;
					border-top-right-radius: 8px;
				`
			}
			else if (props.position === TabPosition.Bottom) {
				return `
					border-top-left-radius: 8px;
					border-top-right-radius: 8px;
				`
			}
		}}
	}
`

type TabProps = Pick<Props, 'position'> & { active: boolean }
export const Tab = styled.li`
	align-content: center;
	background: linear-gradient(
		${(p: TabProps) => p.position === TabPosition.Bottom ?
			'to bottom' :
			p.position === TabPosition.Left ? 'to left' : 'to right'
		},
		#EEE,
		#CCC
	);
	border: 1px solid #CCC;
	border-right: 0;
	color: ${(props: TabProps) => props.active ? '#EEE' : '#888'};
	display: ${props => props.position === TabPosition.Bottom ? 'inline-block' : 'grid'};
	justify-content: center;
	transition: all 150ms;

	font-size: .66em;
	font-weight: bold;
	white-space: nowrap;
	text-transform: uppercase;

	& + li {
		border-top: 0;
	}

	${(props: TabProps) => {
		if (props.position === TabPosition.Left || props.position === TabPosition.Right) {
			const style = `
				height: 100px;

				& > span {
					transform: rotate(${props.position === TabPosition.Left ? '-90deg' : '90deg'});
				}
			`
			return (props.active) ?
				`${style} background: ${Colors.GreyLight};` :
				style
		}
		else if (props.position === TabPosition.Bottom) {
			const style = `
				width: 100px;
			`
			return (props.active) ?
				`${style} background: black;` :
				style
		}
	}}
`
	// transform: rotate(0deg);


	// &:hover {
	// 	color: #777;
	// 	font-size: .8em;
	// 	transform: rotate(-90deg);

	// 	& > span {
	// 		transform: rotate(90deg);
	// 	}
	// }

interface WProps {
	position?: TabPosition
}
interface Props extends WProps {
	onClick: (tab: SearchTab | FooterTab | AsideTab) => void
	tab: SearchTab | FooterTab | AsideTab
	tabs: (SearchTab | FooterTab | AsideTab)[]
}

function Tabs(props: Props) {
	const handleTabClick = React.useCallback(ev => {
		props.onClick(ev.currentTarget.dataset.tab)
	}, [])

	return (
		<Wrapper position={props.position}>
			{
				props.tabs
					.map((tab) => {
						// const Icon = icons[tab]
						return (
							<Tab
								active={props.tab === tab}
								data-tab={tab}
								key={tab}
								onClick={handleTabClick}
								position={props.position}
							>
								<span>{tab}</span>
								{/* {
									Icon != null ?
										<Icon active={props.tab === tab} /> :
										tab.slice(0, 1)
								} */}
							</Tab>
						)
					})
			}
		</Wrapper>
	)
}

Tabs.defaultProps = {
	position: TabPosition.Right
}

export default React.memo(Tabs)
