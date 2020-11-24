import React from 'react'
import { LayerContext } from '@docere/common'

import type { StatefulLayer } from '@docere/common'

interface Props {
	children: React.ReactNode
	value: StatefulLayer
}
export function LayerProvider(props: Props) {
	return (
		<LayerContext.Provider value={props.value}>
			{props.children}
		</LayerContext.Provider>
	) 
}
