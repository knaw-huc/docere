// import type { TextLayer } from '../entry/layer'

export type ReactComponent = React.FunctionComponent<ComponentProps>
export type DocereComponents = Record<string, ReactComponent>

export interface ComponentProps {
	attributes?: Record<string, string>
	children?: React.ReactNode
}

// export type DocereComponentProps =
// 	ComponentProps &
// 	{
// 		// components: DocereComponents
// 		// insideNote: boolean
// 		// layer: TextLayer
// 	}
