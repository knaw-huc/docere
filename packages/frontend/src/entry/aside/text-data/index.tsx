import * as React from 'react'
import EntityList from "./list"
import { useTextData, Wrapper } from '../list'
import AppContext from '../../../app/context'

type Props =
	Pick<EntryState, 'activeEntity' | 'layers'> &
	{
		active: boolean
		entryDispatch: React.Dispatch<EntryStateAction>
		entities: Entity[]
	}

function EntitiesAside(props: Props) {
	const appContext = React.useContext(AppContext)
	const wrapperRef: React.RefObject<HTMLDivElement> = React.useRef()
	const [entitiesByType, types, activeType, setActiveType] = useTextData(props.entities, props.activeEntity)

	return (
		<Wrapper
			active={props.active}
			ref={wrapperRef}
		>
			{
				types.map((type) =>
					<EntityList
						active={activeType === type}
						activeEntity={props.activeEntity}
						config={appContext.config.entities.find(td => td.id === type)}
						containerHeight={wrapperRef.current.getBoundingClientRect().height}
						entryDispatch={props.entryDispatch}
						entitiesByType={entitiesByType}
						key={type}
						setActiveType={setActiveType}
						type={type}
					/>
				)
			}
		</Wrapper>

	)
}

export default React.memo(EntitiesAside)
