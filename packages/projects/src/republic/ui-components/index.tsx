import { UIComponentType } from '@docere/common'
import { TextEntity } from '@docere/ui-components'

const components = new Map()
const entities = new Map()

components.set(UIComponentType.Entity, entities)

entities.set('line', TextEntity)

export default components
