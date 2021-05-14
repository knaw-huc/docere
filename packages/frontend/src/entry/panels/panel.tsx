import React from 'react'
import { isTextLayer, isFacsimileLayer } from '@docere/common'

import { FacsimilePanel } from './facsimile'
import TextPanel from './text'

import type { Layer } from '@docere/common'



export default function Panel(props: { layer: Layer }) {
	if (isFacsimileLayer(props.layer)) {
		return (
			<FacsimilePanel
				key={props.layer.id}
				layer={props.layer}
			/>
		)
	} 

	if (isTextLayer(props.layer)) {
		return (
			<TextPanel
				key={props.layer.id}
				layer={props.layer}
			/>
		)
	}
}



					// if (ap.type === LayerType.WitnessAnimation) {
					// 	return (
					// 		<WitnessAnimationPanel
					// 			activeFacsimileAreas={props.activeFacsimileAreas}
					// 			activeFacsimilePath={props.activeFacsimilePath}
					// 			activeEntity={props.activeEntity}
					// 			activeNote={props.activeNote}
					// 			configData={props.configData}
					// 			dispatch={props.dispatch}
					// 			entry={props.entry}
					// 			key={ap.id}
					// 			textLayerConfig={ap}
					// 		/>
					// 	)
					// }
