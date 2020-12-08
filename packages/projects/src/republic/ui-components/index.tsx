import { UIComponentType } from '@docere/common'
import { EntityWithPlainTextBody } from '@docere/text-components'

const components = new Map()
const entities = new Map()

components.set(UIComponentType.Entity, entities)

entities.set('line', EntityWithPlainTextBody)

export default components
