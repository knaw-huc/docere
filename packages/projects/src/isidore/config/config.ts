import { DocereConfig, Colors, LayerType } from '@docere/common'
import { extractEntryPartElements } from '../../utils'
import extractFacsimiles from './facsimiles'

const config: DocereConfig = {
	slug: 'isidore',
	title: "Isidore's Ethymologiae",
	private: true,
	entities: [
		{
			color: Colors.BlueBright,
			id: 'gloss',
			extract: layerElement => Array.from(layerElement.querySelectorAll('gloss[corresp]'))
				.map(el => ({
					anchors: [el],
					content: el.outerHTML,
					id: el.getAttribute('corresp').slice(1),
					value: el.textContent,
				})),
			revealOnHover: true
		}
	],
	layers: [
		{
			id: 'facsimile',
			type: LayerType.Facsimile,
		},
		{
			// TODO add this as a default extractor function
			// extractElement: entry => entry.preparedElement,
			extractFacsimiles,
			id: 'text',
			type: LayerType.Text,
		},
	],
	parts: {
		extract: extractEntryPartElements('div[type="chapter"][n]', 'n')
	}
}

export default config
