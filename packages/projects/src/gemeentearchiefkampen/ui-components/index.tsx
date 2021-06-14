import { UIComponentType } from '@docere/common'
import { EntityComponentProps, EntityWrapper, TextEntity } from '@docere/ui-components'
import { SearchResult } from './search-result'
import { AttendantEntity } from './attendant'
import React from 'react'

const components = new Map()
const entities = new Map()

components.set(UIComponentType.Entity, entities)
components.set(UIComponentType.SearchResult, SearchResult)

entities.set('line', TextEntity)
entities.set('resolution', EmptyEntity)
entities.set('attendance_list', EmptyEntity)
entities.set('attendant', AttendantEntity)

export default components


function EmptyEntity(props: EntityComponentProps) {
	return (
		<EntityWrapper
			entity={props.entity}
		/>
	)
}
