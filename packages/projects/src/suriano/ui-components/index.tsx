import { UIComponentType } from '@docere/common'
import { PagePartEntity, XmlEntity } from '@docere/ui-components'


const entities = new Map()
entities.set('biblio', XmlEntity)
entities.set('personography', PagePartEntity)

const components = new Map()
components.set(UIComponentType.Entity, entities)

export default components
