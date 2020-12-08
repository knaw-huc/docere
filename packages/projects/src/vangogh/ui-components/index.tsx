import { UIComponentType } from '@docere/common'
import SearchResult from './search-result'
import { TextEntity, EntryLinkEntity } from '@docere/ui-components'

const searchResults = new Map()
searchResults.set('_default', SearchResult)

const entities = new Map()
entities.set('entry-link', EntryLinkEntity)
entities.set('note-link', EntryLinkEntity)
entities.set('pers', TextEntity)

const components = new Map()
components.set(UIComponentType.SearchResult, searchResults)
components.set(UIComponentType.Entity, entities)

export default components
