import * as React from 'react'
import FacsimilePanel from './facsimile'
import TextPanel from './text'
// import WitnessAnimationPanel from './witness-animation'
import XmlPanel from './xml'
import { isTextLayer, isXmlLayer, getTextPanelWidth } from '../../utils'
import styled from '@emotion/styled'
import { DEFAULT_SPACING, LayerType } from '@docere/common'

interface PWProps {
	activeEntity: Entity
	activeLayers: Layer[]
	activeNote: Note
	panelsTextPopup: EntrySettings['panels.text.popup']
}
const Wrapper = styled.div`
	display: grid;
	height: 100%;
	${(p: PWProps) => {
		const tpw = getTextPanelWidth(p.panelsTextPopup, p.activeNote, p.activeEntity)

		let columns = p.activeLayers
			.map(layer => {
				return isTextLayer(layer) ?
					`${tpw}px` :
					`minmax(${DEFAULT_SPACING * 10}px, auto)`
			})
			.join(' ')

		// If there is no facsimile active, the text panels should fill the available
		// space (1fr)
		if (!p.activeLayers.some(ap => ap.type === LayerType.Facsimile)) {
			columns = p.activeLayers.map(() => `minmax(${tpw}px, 1fr)`).join(' ')
		}
		return `
			grid-template-columns: ${columns};
			grid-template-rows: 100% auto;
		`
	}}
	overflow-x: auto; 
	width: 100%;
`

function Panels(props: PanelsProps) {
	const activeLayers = props.layers.filter(ap => ap.active)

	return (
		<Wrapper
			activeLayers={activeLayers}
			activeEntity={props.activeEntity}
			activeNote={props.activeNote}
			className="panels"
			panelsTextPopup={props.settings['panels.text.popup']}
		>
			{
				activeLayers.map(layer => {
					if (layer.type === LayerType.Facsimile) {
						return (
							<FacsimilePanel
								activeFacsimile={props.activeFacsimile}
								activeFacsimileAreas={props.activeFacsimileAreas}
								entryDispatch={props.entryDispatch}
								key={layer.id}
							/>
						)
					}

					if (isTextLayer(layer)) {
						return (
							<TextPanel
								activeFacsimileAreas={props.activeFacsimileAreas}
								activeFacsimile={props.activeFacsimile}
								activeEntity={props.activeEntity}
								activeNote={props.activeNote}
								appDispatch={props.appDispatch}
								entryDispatch={props.entryDispatch}
								entry={props.entry}
								key={layer.id}
								searchQuery={props.searchQuery}
								settings={props.settings}
								layer={layer}
							/>
						)
					}

					if (isXmlLayer(layer)) {
						return (
							<XmlPanel
								key={layer.id}
								doc={props.entry.doc}
							/>
						)
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
				})
			}
		</Wrapper>
	)
}

export default React.memo(Panels)
