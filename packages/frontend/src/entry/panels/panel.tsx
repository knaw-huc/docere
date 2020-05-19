import React from 'react'
import FacsimilePanel from './facsimile'
import TextPanel from './text'
// import WitnessAnimationPanel from './witness-animation'
import XmlPanel from './xml'

import { isTextLayer, isXmlLayer } from '../../utils'
import { LayerType } from '@docere/common'

import type { Layer } from '@docere/common'
import type { PanelsProps } from '.'


export default function Panel(props: PanelsProps & { layer: Layer }) {
	if (props.layer.type === LayerType.Facsimile) {
		return (
			<FacsimilePanel
				activeFacsimile={props.activeFacsimile}
				activeFacsimileAreas={props.activeFacsimileAreas}
				entryDispatch={props.entryDispatch}
				key={props.layer.id}
				layer={props.layer}
				settings={props.settings}
			/>
		)
	}

	if (isTextLayer(props.layer)) {
		return (
			<TextPanel
				activeFacsimileAreas={props.activeFacsimileAreas}
				activeFacsimile={props.activeFacsimile}
				activeEntity={props.activeEntity}
				activeNote={props.activeNote}
				appDispatch={props.appDispatch}
				entryDispatch={props.entryDispatch}
				entry={props.entry}
				key={props.layer.id}
				settings={props.settings}
				layer={props.layer}
			/>
		)
	}

	if (isXmlLayer(props.layer)) {
		return (
			<XmlPanel
				doc={props.entry.doc}
				key={props.layer.id}
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