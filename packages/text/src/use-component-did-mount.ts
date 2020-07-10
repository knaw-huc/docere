import React from 'react'

import type { DocereTextViewProps } from '.'

export default function useComponentDidMount(props: DocereTextViewProps, tree: React.ReactNode, wrapperEl: Element) {
	const [isReady, setIsReady] = React.useState(false)

	React.useEffect(() => {
		if (!isReady && tree != null) {
			if (props.onLoad != null) props.onLoad(true, wrapperEl)
			setIsReady(true)
		}
	}, [tree])

	React.useEffect(() => {
		if (props.onLoad != null) props.onLoad(false, wrapperEl)
		setIsReady(false)
	}, [props.xml, props.node, props.url, props.html])
}
