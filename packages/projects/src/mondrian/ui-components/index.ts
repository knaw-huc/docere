import { UIComponentType } from '@docere/common'
import { PagePartEntity, XmlEntity } from '@docere/ui-components'
import { RkdArtwork } from './rkd-artwork'


const entities = new Map()
entities.set('rkd-artwork-link', RkdArtwork)
entities.set('editor', XmlEntity)
entities.set('bio', PagePartEntity)
entities.set('biblio', PagePartEntity)

const components = new Map()
components.set(UIComponentType.Entity, entities)

export default components
