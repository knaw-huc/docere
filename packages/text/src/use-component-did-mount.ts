import React from 'react'

import type { DocereTextViewProps } from '.'

export default function useComponentDidMount(
	props: DocereTextViewProps,
	tree: React.ReactNode,
	wrapperEl: Element
) {
	const [isReady, setIsReady] = React.useState(false)

	React.useEffect(() => {
		if (!isReady && tree != null) {
			if (props.onLoad != null) {
				setTimeout(() => props.onLoad(true, wrapperEl), 0)
			}
			setIsReady(true)
		}
	}, [isReady, tree, wrapperEl])

	React.useEffect(() => {
		if (props.onLoad != null) props.onLoad(false, wrapperEl)
		setIsReady(false)
	}, [props.xml, props.node, props.url, props.html])
}
