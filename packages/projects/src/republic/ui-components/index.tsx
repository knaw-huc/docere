import { UIComponentType } from '@docere/common'
import { TextEntity } from '@docere/ui-components'
import { SearchResult } from './search-result'

const components = new Map()
const entities = new Map()

components.set(UIComponentType.Entity, entities)
components.set(UIComponentType.SearchResult, SearchResult)

entities.set('line', TextEntity)

export default components

