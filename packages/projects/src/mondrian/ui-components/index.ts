import { UIComponentType } from '@docere/common'
import { PagePartEntity, XmlEntity } from '@docere/ui-components'
import { RkdArtwork } from './rkd-artwork'
import { SearchResult } from './search-result'
import { MainHeader } from './main-header'


const entities = new Map()
entities.set('rkd-artwork-link', RkdArtwork)
entities.set('editor', XmlEntity)
entities.set('bio', PagePartEntity)
entities.set('biblio', PagePartEntity)

const components = new Map()
components.set(UIComponentType.Entity, entities)
components.set(UIComponentType.SearchResult, SearchResult)
components.set(UIComponentType.MainHeader, MainHeader)

export default components
