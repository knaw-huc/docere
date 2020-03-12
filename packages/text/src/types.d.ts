/// <reference types="@docere/common" />

type ComponentLeaf = ComponentTree | string
interface ComponentTree { componentClass: ReactComponent, props: any, children: ComponentLeaf[] }

interface DocereTextViewProps {
	components?: DocereComponents
	// TODO rename to componentProps
	customProps?: { [ key: string ]: any }
	highlight?: string[]
	html?: string
	ignore?: string[]
	onLoad?: (isReady: boolean) => void
	node?: Node
	onRootElementChange?: (newRoot: Element) => void
	rootSelector?: string
	setHighlightAreas?: (areas: number[]) => void
	url?: string
	xml?: string
}
