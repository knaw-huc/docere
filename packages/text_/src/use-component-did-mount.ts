import * as React from 'react'
import { DocereTextViewProps } from '.'

export default function useComponentDidMount(props: DocereTextViewProps, tree: React.ReactNode) {
	const [isReady, setIsReady] = React.useState(false)

	React.useEffect(() => {
		if (!isReady && tree != null) {
			if (props.onLoad != null) props.onLoad(true)
			setIsReady(true)
		}
	}, [tree])
	React.useEffect(() => {
		if (props.onLoad != null) props.onLoad(false)
		setIsReady(false)
	}, [props.xml, props.node, props.url, props.html])
}
