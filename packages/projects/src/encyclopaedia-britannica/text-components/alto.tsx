import React from 'react'
import styled from 'styled-components'
import { Lb } from '@docere/text-components'
import { Colors } from '@docere/common'

import type { DocereComponents } from '@docere/common'

// TODO move alto to text-components, see duplication in gheys/htr-layers

// function setActiveFacsimileArea(dispatch: React.Dispatch<EntryStateAction>, ids: string[]) {
// 	dispatch({
// 		type: 'SET_ACTIVE_FACSIMILE_AREAS',
// 		ids,
// 	})
// }

// function useActive(props: DocereComponentProps): [boolean, (ev: any) => void] {
// 	const [active, setActive] = React.useState<boolean>(false)

// 	React.useEffect(() => {
// 		setActive(props.activeFacsimileAreas?.some(fa => props.attributes.ID === fa.id))
// 	}, [props.activeFacsimileAreas])

// 	const handleClick = React.useCallback(ev => {
// 		ev.stopPropagation()
// 		setActiveFacsimileArea(props.entryDispatch, [props.attributes.ID])
// 	}, [props.attributes.ID, active])

// 	return [active, handleClick]
// }

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

// TODO fix useActive
function TextLine(props: { children: React.ReactNode }) {
	// const [active, handleClick] = useActive(props)

	return (
		<TextLineWrapper
			active={false}
			// onClick={handleClick}
			// {...props}
		>
			{props.children}
		</TextLineWrapper>
	)
}

// const EntityThumb = styled.img`
// 	box-sizing: border-box;
// 	padding: 1rem;
// `

// function EntityPopupBody(props: EntityComponentProps) {
// 	const { HPOS, VPOS, WIDTH, HEIGHT } = props.entity.attributes
// 	const rect = `${HPOS},${VPOS},${WIDTH},${HEIGHT}`
// 	// const activeFacsimile = props.docereComponentProps.activeFacsimiles.values().next().value
// 	const { activeFacsimile } = React.useContext(FacsimileContext)

// 	return (
// 		<EntityThumb
// 			src={activeFacsimile.versions[0].path.replace('info.json', `${rect}/240,/0/default.jpg`)}
// 			width="100%"
// 		/>
// 	)
// }

function SP() { return <> </> }
//
const components: DocereComponents = {
	Description: () => null,
	// String: getEntity(EntityPopupBody),
	SP,
	TextLine,
}
export default components
