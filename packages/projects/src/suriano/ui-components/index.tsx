import { UIComponentType } from '@docere/common'
import { PagePartEntity, XmlEntity } from '@docere/ui-components'
import { SearchResult } from './search-result'


const entities = new Map()
entities.set('biblio', XmlEntity)
entities.set('personography', PagePartEntity)

const components = new Map()
components.set(UIComponentType.Entity, entities)

components.set(UIComponentType.SearchResult, SearchResult)

export default components
