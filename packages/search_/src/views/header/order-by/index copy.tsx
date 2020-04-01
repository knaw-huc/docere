import React from 'react'
import styled from 'styled-components'

import { Button } from '../page-number'
import OrderOption from './option'

const Wrapper = styled.div`
	display: inline-block;
`

const SortByButton = styled(Button)`
	border: 1px solid rgba(0, 0, 0, 0);
	position: relative;
	z-index: 1000;
	transition: all 300ms;

	${(props: { showMenu: boolean }) => {
		if (props.showMenu) {
			return `
				border: 1px solid #888;
				border-bottom: 1px solid white;
				padding: 0 12px;
			`
		}
	}}
`

const OrderOptions = styled.ul`
	background: white;
	border: 1px solid #888;
	left: 32px;
	line-height: 1.6em;
	margin-top: -1px;
	opacity: ${(props: { showMenu: boolean }) => props.showMenu ? 1 : 0};
	padding: .5em 1em;
	position: absolute;
	transition: opacity 300ms;
	width: 240px;
	z-index: 999;
`

interface Props {
	facetsData: FacetsData
	setSortOrder: SetSortOrder
	sortOrder: SortOrder
}
function OrderBy(props: Props) {
	const [showMenu, setShowMenu] = React.useState(false)

	const handleClick = React.useCallback(ev => {
		ev.stopPropagation()

		const hideMenu = () => setShowMenu(false)
		if (!showMenu) window.addEventListener('click', hideMenu)
		else window.removeEventListener('click', hideMenu)
		
		setShowMenu(!showMenu)
	}, [showMenu])

	return (
		<Wrapper>
			<SortByButton
				onClick={handleClick}
				showMenu={showMenu}
			>
				sort by ({props.sortOrder.size}) ▾
			</SortByButton>
			<OrderOptions showMenu={showMenu}>
				{
					Array.from(props.facetsData.values())
						.sort((field1, field2) => {
							const a = props.sortOrder.has(field1.id)
							const b = props.sortOrder.has(field2.id)
							if (a === b) return field1.order - field2.order
							return a ? -1 : 1
						})
						.map(field =>
							<OrderOption
								facetData={field}
								key={field.id}
								sortOrder={props.sortOrder}
								setSortOrder={props.setSortOrder}
							/>
						)
				}
			</OrderOptions>
		</Wrapper>
	)
}

export default React.memo(OrderBy)
