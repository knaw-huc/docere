import * as React from 'react'
import { RsType } from '@docere/common'
import styled from 'styled-components'
import Popup from './popup'

// Person
function PersonSvg(props: Pick<RsProps, 'active' | 'config' | 'onClick'>) {
	return (
		<svg
			onClick={ev => props.onClick != null ? props.onClick(ev) : null}
			style={{ width: 20, height: 20, verticalAlign: 'text-top' }}
			viewBox="0 0 64 54"
		>
			<path
				fill={props.active ? 'white' : props.config.color}
				d="M31.941,36.688c-7.102,0-12.856-6.898-12.856-15.401c0-8.502,5.754-14.804,12.856-14.804c7.103,0,12.862,6.302,12.862,14.804C44.803,29.79,39.044,36.688,31.941,36.688z M11.943,57.508c0,0-2.727,0.18-3.928-1.475c-0.649-0.894-0.197-2.706,0.247-3.717l1.087-2.477c0,0,3.006-6.723,6.428-10.619c2.102-2.389,4.602-1.845,6.219-1.068c0.996,0.478,2.122,1.871,2.945,2.609c1.134,1.017,3.136,2.173,6.409,2.238h2.008c3.271-0.065,5.273-1.221,6.406-2.238c0.822-0.738,1.917-2.174,2.904-2.668c1.484-0.743,3.743-1.2,5.79,1.127c3.423,3.896,6.134,10.741,6.134,10.741l1.114,2.429c0.461,1.004,0.933,2.807,0.302,3.713c-1.126,1.62-3.654,1.405-3.654,1.405H11.943z"
			/>
		</svg>
	)
}


// Place
function LocationSvg(props: Pick<RsProps, 'active' | 'config' | 'onClick'>) {
	return (
		<svg
			onClick={ev => props.onClick != null ? props.onClick(ev) : null}
			style={{ width: 20, height: 20, verticalAlign: 'text-top' }}
			viewBox="0 0 512 512"
		>
			<path
				fill={props.active ? 'white' : props.config.color}
				d="M256,22.709c-85.1,0-154.334,69.234-154.334,154.333c0,34.275,21.887,90.155,66.908,170.834c31.846,57.063,63.168,104.643,64.484,106.64L256,489.291l22.941-34.774c1.318-1.998,32.641-49.578,64.484-106.64c45.023-80.68,66.908-136.559,66.908-170.834C410.334,91.943,341.1,22.709,256,22.709z M256,256c-44.182,0-80-35.817-80-80s35.818-80,80-80s80,35.817,80,80S300.182,256,256,256z" />
		</svg>
	)
}

function DateSvg(props: Pick<RsProps, 'active' | 'config' | 'onClick'>) {
	const bgColor = props.active ? props.config.color : 'white'
	const fgColor = props.active ? 'white' : props.config.color

	return (
		<svg
			style={{ width: 18, height: 18, marginRight: '.35em' }}
			viewBox="0 0 150 150"
		>
			<rect x="0" y="0" width="150" height="150" rx="0" ry="0" fill={bgColor} />

			<rect x="40" y="0" height="30" width="30" fill={fgColor} />
			<rect x="80" y="0" height="30" width="30" fill={fgColor} />
			<rect x="120" y="0" height="30" width="30" fill={fgColor} />

			<rect x="0" y="40" height="30" width="30" fill={fgColor} />
			<rect x="40" y="40" height="30" width="30" fill={fgColor} />
			<rect x="80" y="40" height="30" width="30" fill={fgColor} />
			<rect x="120" y="40" height="30" width="30" fill={fgColor} />

			<rect x="0" y="80" height="30" width="30" fill={fgColor} />
			<rect x="40" y="80" height="30" width="30" fill={fgColor} />
			<rect x="80" y="80" height="30" width="30" fill={fgColor} />
			<rect x="120" y="80" height="30" width="30" fill={fgColor} />

			<rect x="0" y="120" height="30" width="30" fill={fgColor} />
			<rect x="40" y="120" height="30" width="30" fill={fgColor} />
		</svg>
	)
}

const svgByType: Record<string, React.FC<Pick<RsProps, 'active' | 'config' | 'onClick'>>> = {
	[RsType.Date]: DateSvg,
	[RsType.Location]: LocationSvg,
	[RsType.Person]: PersonSvg,
	[RsType.None]: null,
}

interface NWProps { openToAside: boolean }
const NoWrap = styled.span`
	display: inline-block;
	position: ${(props: NWProps) => props.openToAside ? 'static' : 'relative'};
	white-space: nowrap;
`

export const EntityWrapper = styled.span`
	background-color: ${(props: Pick<RsProps, 'active' | 'revealOnHover'> & { color: string}) => {
		return props.active ? props.color : 'rgba(0, 0, 0, 0)'
	}};
	${props => 
		props.active ?
			`border-bottom: 3px solid ${props.color};` :
			props.revealOnHover ?
				`&:hover {
					border-bottom: 3px solid ${props.color};
				}` :
				`border-bottom: 3px solid ${props.color};`
	}
	color: ${props => props.active ? 'white' : 'inherit'};
	cursor: pointer;
	padding: 0 2px;
	transition: all 300ms;
`

export default function Rs(props: RsProps) {
	const [showTooltip, setShowTooltip] = React.useState(false)
	const [openToAside, setOpenToAside] = React.useState(props.customProps.entrySettings['panels.text.popup'] === 'aside')
	const Icon = svgByType[props.config.type]

	// To prevent a wrap between the icon and the first word the first word is extracted.
	// The icon and the first word are placed inside a span with white-space: nowrap.
	const children = React.Children.toArray(props.children)
	let firstWord: React.ReactNode = props.children
	let restOfFirstChild: string
	if (Icon != null && children.length && typeof children[0] === 'string') {
		const [fw, ...rofc] = children[0].split(/\s/)
		firstWord = fw
		restOfFirstChild = rofc.length ? ' '.concat(rofc.join(' ')) : ''
	}

	React.useEffect(() => {
		if (!props.active) setShowTooltip(false)
		setOpenToAside(props.active && props.customProps.entrySettings['panels.text.popup'] === 'aside')
	}, [props.active, props.customProps.entrySettings['panels.text.popup']])

	return (
		<EntityWrapper
			active={props.active}
			color={props.config.color}
			onClick={ev => {
				setShowTooltip(!showTooltip)
				props.onClick(ev)
			}}
			revealOnHover={props.revealOnHover}
		>
			<NoWrap
				openToAside={openToAside}
			>
				{
					Icon != null &&
					<Icon
						active={props.active}
						config={props.config}
					/>
				}
				{firstWord}
				<Popup
					active={showTooltip}
					color={props.config.color}
					docereComponentProps={props.customProps}
					node={null}
					openToAside={openToAside}
					title={props.config.type.toString()}
				/>
			</NoWrap>
			{restOfFirstChild}
			{children.slice(1)}
		</EntityWrapper>
	)
}

const defaultProps: Partial<RsProps> = {
	active: false,
	revealOnHover: false,
}
Rs.defaultProps = defaultProps
