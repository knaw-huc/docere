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
			extract: ({ layerElement, entityConfig }) => Array.from(layerElement.querySelectorAll(entityConfig.selector))
				.map(el => ({
					anchors: [el],
					content: el.outerHTML,
					value: el.textContent,
				})),
			extractId: el => el.getAttribute('corresp').slice(1),
			revealOnHover: true,
			selector: 'gloss[corresp]',
		}
	],
	facsimiles: {
		extractFacsimileId: el => el.getAttribute('xml:id'),
		extractFacsimiles,
		selector: 'facsimile surface'
	},
	layers: [
		{
			id: 'facsimile',
			type: LayerType.Facsimile,
		},
		{
			// TODO add this as a default extractor function
			// extractElement: entry => entry.preparedElement,
			id: 'text',
			type: LayerType.Text,
		},
	],
	parts: {
		extract: extractEntryPartElements('div[type="chapter"][n]', 'n')
	}
}

export default config
