import type { ReactComponent } from '@docere/common'

export type ComponentLeaf = ComponentTree | string
export interface ComponentTree { componentClass: ReactComponent, props: any, children: ComponentLeaf[] }
