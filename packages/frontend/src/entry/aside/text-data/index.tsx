import * as React from 'react'
import EntityList from "./list"
import { useTextData, Wrapper } from '../list'
import ProjectContext from '../../../app/context'
import type { EntryState, EntryStateAction, Entity, AppStateAction } from '@docere/common'

type Props =
	Pick<EntryState, 'activeEntity' | 'layers'> &
	{
		active: boolean
		appDispatch: React.Dispatch<AppStateAction>
		entryDispatch: React.Dispatch<EntryStateAction>
		entities: Entity[]
	}

function EntitiesAside(props: Props) {
	const { config } = React.useContext(ProjectContext)
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
						appDispatch={props.appDispatch}
						config={config.entities.find(td => td.id === type)}
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
