import type { DocereAnnotation, DocereAnnotationProps } from "../standoff-annotations"

export type ReactComponent = React.FunctionComponent<DocereAnnotationProps>
export type DocereComponents = Record<string, ReactComponent> & {
	_find?: (a: DocereAnnotation) => ReactComponent
}

// export interface ComponentProps {
// 	attributes?: Record<string, string>
// 	children?: React.ReactNode
// }
