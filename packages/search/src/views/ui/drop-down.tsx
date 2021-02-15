import { SearchPropsContext } from '@docere/common'
import React from 'react'
import styled from 'styled-components'
import { Button } from '../button'

const Wrapper = styled.div`
	display: inline-block;
`

const DropDownButton = styled(Button)`
	background: rgba(0, 0, 0, 0);
	border: 1px solid rgba(0, 0, 0, 0);
	position: relative;
	transition: all 300ms;
	white-space: nowrap;
	z-index: ${props => props.z + 1};

	& > span {
		font-size: .65rem;
	}

	${(props: { showMenu: boolean, z: number }) => {
		if (props.showMenu) {
			return `
				background: white;
				border: 1px solid #888;
				border-bottom: 1px solid white;
				padding: 0 12px;
			`
		}
	}}
`

export const DropDownBody = styled.div`
	background: white;
	border: 1px solid #888;
	line-height: 1.6em;
	margin-top: -1px;
	min-width: 200px;
	opacity: ${(props: { show?: boolean, z?: number }) => props.show ? 1 : 0};
	padding: .5em 1em;
	pointer-events: ${props => props.show ? 'all' : 'none'};
	position: absolute;
	transition: opacity 300ms;
	z-index: ${props => props.z};

	& > div {
		color: #888;
		font-size: .9rem;

		&:hover {
			cursor: pointer;
			color: #444;
		}
	}

	& > div:not(:last-of-type) {
		border-bottom: 1px solid #EEE;
	}
`
DropDownBody.defaultProps = { show: true, z: 0 }

interface Props {
	children: React.ReactNode
	className?: string
	label: string
	z: number
}
function DropDown(props: Props) {
	const context = React.useContext(SearchPropsContext)
	const [showBody, setShowBody] = React.useState(false)
	const hideMenu = React.useCallback(() => setShowBody(false), [])

	const handleClick = React.useCallback(ev => {
		ev.stopPropagation()
		setShowBody(!showBody)
	}, [showBody])

	React.useEffect(() => {
		if (showBody) window.addEventListener('click', hideMenu)
		else window.removeEventListener('click', hideMenu)

		return () => window.removeEventListener('click', hideMenu)
	}, [showBody])

	return (
		<Wrapper className={props.className}>
			<DropDownButton
				className="huc-fs-dropdown-button"
				onClick={handleClick}
				showMenu={showBody}
				spotColor={context.style.spotColor}
				z={props.z}
			>
				{props.label} <span>{showBody ? '▲' : '▼'}</span>
			</DropDownButton>
			<DropDownBody
				className="huc-fs-dropdown-body"
				show={showBody}
				z={props.z}
			>
				{props.children}
			</DropDownBody>
		</Wrapper>
	)
}

export default React.memo(DropDown)
