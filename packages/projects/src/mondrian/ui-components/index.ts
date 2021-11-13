import { UIComponentType } from '@docere/common'
import { PagePartEntity, XmlEntity } from '@docere/ui-components'
import { RkdArtwork } from './rkd-artwork'
import { SearchResult } from './search-result'


const entities = new Map()
entities.set('rkd-artwork-link', RkdArtwork)
entities.set('editor', XmlEntity)
entities.set('bio', PagePartEntity)
entities.set('biblio', PagePartEntity)

const components = new Map()
components.set(UIComponentType.Entity, entities)
components.set(UIComponentType.SearchResult, SearchResult)

export default components
