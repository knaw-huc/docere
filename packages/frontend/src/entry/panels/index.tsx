import * as React from 'react'
import FacsimilePanel from './facsimile'
import TextPanel from './text'
// import WitnessAnimationPanel from './witness-animation'
import XmlPanel from './xml'
import { isTextLayer, isXmlLayer } from '../../utils'
import styled from '@emotion/styled'
import { DEFAULT_SPACING, LayerType, getTextPanelWidth } from '@docere/common'

interface PWProps {
	activeEntity: Entity
	activeLayers: Layer[]
	activeNote: Note
	settings: EntrySettings
}
const Wrapper = styled.div`
	display: grid;
	height: 100%;
	${(p: PWProps) => {
		const tpw = getTextPanelWidth(p.settings, p.activeNote, p.activeEntity)

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

	& > header {
		height: ${DEFAULT_SPACING}px;
		display: grid;
		align-content: center;
		padding: 0 ${DEFAULT_SPACING}px;
		font-size: .8rem;
		background: gray;
		color: white;
		text-transform: uppercase;
		border-right: 2px solid #4a4a4a;
	}
`

function Panels(props: PanelsProps) {
	const activeLayers = props.layers.filter(ap => ap.active)

	return (
		<Wrapper
			activeLayers={activeLayers}
			activeEntity={props.activeEntity}
			activeNote={props.activeNote}
			className="panels"
			settings={props.settings}
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
								layer={layer}
								settings={props.settings}
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
