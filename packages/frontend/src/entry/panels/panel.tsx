import React from 'react'
import FacsimilePanel from './facsimile'
import TextPanel from './text'

import { isTextLayer, isFacsimileLayer } from '@docere/common'

import type { Layer } from '@docere/common'
import type { PanelsProps } from '.'

export default function Panel(props: PanelsProps & { layer: Layer }) {
	if (isFacsimileLayer(props.layer)) {
		return (
			<FacsimilePanel
				activeEntities={props.activeEntities}
				activeFacsimiles={props.activeFacsimiles}
				entry={props.entry}
				entryDispatch={props.entryDispatch}
				entrySettings={props.entrySettings}
				key={props.layer.id}
				layer={props.layer}
			/>
		)
	} 

	if (isTextLayer(props.layer)) {
		return (
			<TextPanel
				activeEntities={props.activeEntities}
				activeFacsimiles={props.activeFacsimiles}
				appDispatch={props.appDispatch}
				entry={props.entry}
				entryDispatch={props.entryDispatch}
				entrySettings={props.entrySettings}
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
