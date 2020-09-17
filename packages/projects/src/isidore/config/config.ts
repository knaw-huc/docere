import { DocereConfig, Colors, ExtractedTextData, LayerType } from '@docere/common'
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
			extract: entry => Array.from(entry.document.querySelectorAll('gloss[corresp]'))
				.map((el): ExtractedTextData => ({
					element: el,
					id: el.getAttribute('corresp').slice(1),
					value: el.textContent,
				})),
			revealOnHover: true
		}
	],
	layers: [
		{
			extract: extractFacsimiles,
			id: 'facsimile',
			type: LayerType.Facsimile,
		},
		{
			// TODO add this as a default extractor function
			extract: entry => entry.element,
			id: 'text',
			type: LayerType.Text,
		},
	],
	parts: {
		extract: extractEntryPartElements('div[type="chapter"][n]', 'n')
	}
}

export default config
