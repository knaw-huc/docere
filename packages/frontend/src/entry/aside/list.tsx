import * as React from 'react'
import styled from 'styled-components'
import { small } from '../index.components'
import { DEFAULT_SPACING, Colors } from '@docere/common'
import type { NotesConfig, TextData } from '@docere/common'

export const Wrapper = styled.div`
	background: ${Colors.Grey};
	bottom: 0;
	height: 100%;
	left: 0;
	position: absolute;
	right: 0;
	top: 0;
	z-index: ${(p: Pick<Props, 'active'>) => p.active ? 1 : -1};
`

export function useTextData<T extends TextData>(textData: T[], activeTextData: T): [Map<string, T[]>, string[], string, any] {
	const [textDataByType, setTextDataByType] = React.useState<Map<string, T[]>>(new Map())
	const [types, setTypes] = React.useState<string[]>([])
	const [activeType, setActiveType] = React.useState<string>(null)

	React.useEffect(() => {
		const tmp = new Map<string, T[]>()

		for (const entity of textData) {
			const entities = tmp.get(entity.config.id) || []
			tmp.set(entity.config.id, entities.concat(entity))
		}
		const types = Array.from(tmp.keys())

		setTypes(types)
		setActiveType(types[0])
		setTextDataByType(tmp)
	}, [textData])

	React.useEffect(() => {
		if (activeTextData == null) return
		setActiveType(activeTextData.config.id)
	}, [activeTextData])

	return [textDataByType, types, activeType, setActiveType]
}

const H2Height = DEFAULT_SPACING * 1.25

export const H2 = styled.h2`
	background: ${Colors.GreyLight};
	border-top: 1px solid #333;
    box-shadow: 0px 4px 4px -4px #111;
	color: #EEE;
	cursor: pointer;
	font-size: 1em;
	font-weight: normal;
	height: ${H2Height}px;
	line-height: ${H2Height}px;
	margin: 0;
	padding-left: 1em;
	position: relative;
    z-index: 1;

	&:after {
		border-left: 10px solid transparent;
		border-right: 10px solid transparent;
		border-top: 10px solid ${Colors.GreyLight};
		content: '';
		height: 0;
		position: absolute;
		right: 24px;
		top: ${H2Height}px;
		width: 0;
		z-index: 1;
	}

	& small {
		${small}
		color: #AAA;
	}
`

interface UlProps {
	active: boolean
	listCount: number
	height: number
}
export const Ul = styled.ul`
	background: ${Colors.Grey};
	box-sizing: border-box;
	height: ${(props: UlProps) => props.active ? `calc(${props.height}px - ${props.listCount * H2Height}px)` : 0};
	list-style: none;
	margin: 0;
	overflow: auto;
	position: relative;
	transition: height 160ms ease-out;

	${(props: UlProps) => (props.active) ? `& + h2 { box-shadow: 0px -4px 4px -4px #111; }` : ''}
`

interface Props {
	active: boolean
	children: React.ReactNode
	config: NotesConfig
	containerHeight: number
	itemCount: number
	setActiveType: (type: string) => void
	type: string
	typeCount: number
}

function AsideList(props: Props) {
	const title = props.config?.title || props.type

	return (
		<>
			<H2
				onClick={() => props.setActiveType(props.type)}
			>
				{title}
				<small>({props.itemCount})</small>
			</H2>
			<Ul
				active={props.active}
				listCount={props.typeCount}
				height={props.containerHeight}
			>
				{props.children}
			</Ul>
		</>
	)
}

export default React.memo(AsideList)
