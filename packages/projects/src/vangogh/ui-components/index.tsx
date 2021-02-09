import { UIComponentType } from '@docere/common'
import SearchResult from './search-result'
import { TextEntity, EntryLinkEntity } from '@docere/ui-components'

const entities = new Map()
entities.set('entry-link', EntryLinkEntity)
entities.set('note-link', EntryLinkEntity)
entities.set('pers', TextEntity)

const components = new Map()
components.set(UIComponentType.SearchResult, SearchResult)
components.set(UIComponentType.Entity, entities)

export default components
