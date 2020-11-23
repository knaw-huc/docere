import * as React from 'react'
import EntityList from "./list"
import { useTextData, Wrapper } from '../list'
import { ProjectContext } from '@docere/common'
import type { Entity } from '@docere/common'

type Props = {
	active: boolean
}
function EntitiesAside(props: Props) {
	const { config } = React.useContext(ProjectContext)
	const wrapperRef: React.RefObject<HTMLDivElement> = React.useRef()
	const [entitiesByType, types, activeType, setActiveType] = useTextData()

	return (
		<Wrapper
			active={props.active}
			ref={wrapperRef}
		>
			{
				types.map((type) =>
					<EntityList
						active={activeType === type}
						config={config.entities.find(td => td.id === type)}
						containerHeight={wrapperRef.current.getBoundingClientRect().height}
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
