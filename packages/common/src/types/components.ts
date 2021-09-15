import React from "react"
import type { Annotation3, ComponentProps } from "../standoff-annotations"

// export type ReactComponent = React.FunctionComponent<ComponentProps> | ((props: ComponentProps) => React.ReactNode)
export type ReactComponent = React.FunctionComponent<ComponentProps> | React.ComponentClass<ComponentProps> | string
export type DocereComponents = Record<string, ReactComponent> & {
	_find?: (a: Annotation3) => ReactComponent
}

// export interface ComponentProps {
// 	attributes?: Record<string, string>
// 	children?: React.ReactNode
// }
