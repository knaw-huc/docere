import { DocereConfig, LayerType, Colors } from '@docere/common'
// import { extractEntryPartElements } from '../utils'

const config: DocereConfig = {
	slug: 'suriano',
	title: "Suriano",
	private: true,
	// entities: [
	// 	{
	// 		color: Colors.BlueBright,
	// 		id: 'gloss',
	// 		extract: entry => Array.from(entry.document.querySelectorAll('gloss[corresp]'))
	// 			.map((el): ExtractedTextData => ({
	// 				element: el,
	// 				id: el.getAttribute('corresp').slice(1),
	// 				value: el.textContent,
	// 			})),
	// 		revealOnHover: true
	// 	}
	// ],
	layers: [
		// {
		// 	id: 'facsimile',
		// 	type: LayerType.Facsimile,
		// },
		{
			active: true,
			id: 'facsimile',
			type: LayerType.Facsimile,
		},
		{
			// TODO add this as a default extractor function
			// extract: entry => entry.element,
			id: 'text',
			type: LayerType.Text,
		},
	],
	notes: [
		{
			color: Colors.BlueBright,
			id: 'note',
			extract: entry => Array.from(entry.document.querySelectorAll('li[role=doc-endnote]'))
				.map(el => ({
					id: el.id,
					element: el,
					n: el.id.slice(2),
					title: `Note ${el.id.slice(2)}`,
				})),
			title: "Notes",
		},
	],
	// parts: {
	// 	extract: extractEntryPartElements('pb[id]', 'id')
	// }
}

export default config
