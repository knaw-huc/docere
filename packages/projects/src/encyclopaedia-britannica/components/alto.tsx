import React from 'react'
import styled from 'styled-components'
import { getEntity, Lb } from '@docere/text-components'
import { Colors } from '@docere/common'

import type { EntryStateAction, DocereComponentProps, DocereComponents } from '@docere/common'

// TODO move alto to text-components, see duplication in gheys/htr-layers

function setActiveFacsimileArea(dispatch: React.Dispatch<EntryStateAction>, ids: string[]) {
	dispatch({
		type: 'SET_ACTIVE_FACSIMILE_AREAS',
		ids,
	})
}

function useActive(props: DocereComponentProps): [boolean, (ev: any) => void] {
	const [active, setActive] = React.useState<boolean>(false)

	React.useEffect(() => {
		setActive(props.activeFacsimileAreas?.some(fa => props.attributes.ID === fa.id))
	}, [props.activeFacsimileAreas])

	const handleClick = React.useCallback(ev => {
		ev.stopPropagation()
		setActiveFacsimileArea(props.entryDispatch, [props.attributes.ID])
	}, [props.attributes.ID, active])

	return [active, handleClick]
}

const TextLineWrapper = styled(Lb)`
	min-height: 2rem;
	pointer-events: none;

	& * { pointer-events: all; }

	&:before {
		cursor: pointer;
		transition: all 450ms;

		${(props: { active: boolean }) => 
			props.active ?
				`background: ${Colors.Red};
				color: white;
				font-weight: bold;
				` :
				`&:hover {
					border-bottom: 3px solid ${Colors.Red};
					color: ${Colors.Red}
				}`
		}
		
		pointer-events: all;
	}
`

function TextLine(props: DocereComponentProps) {
	const [active, handleClick] = useActive(props)

	return (
		<TextLineWrapper
			active={active}
			onClick={handleClick}
			{...props}
		>
			{props.children}
		</TextLineWrapper>
	)
}

const EntityThumb = styled.img`
	box-sizing: border-box;
	padding: 1rem;
`

function EntityPopupBody(props: DocereComponentProps) {
	const { HPOS, VPOS, WIDTH, HEIGHT } = props.attributes
	const rect = `${HPOS},${VPOS},${WIDTH},${HEIGHT}`

	return (
		<EntityThumb
			src={props.activeFacsimile.versions[0].path.replace('info.json', `${rect}/240,/0/default.jpg`)}
			width="100%"
		/>
	)
}

function SP() { return <> </> }

const components: DocereComponents = {
	Description: () => null,
	String: getEntity({
		// extractType: () => 'word',
		extractKey: props => props.attributes.ID,
		extractValue: props => props.attributes.CONTENT,
		PopupBody: EntityPopupBody,
	}),
	SP,
	TextLine,
}
export default components
