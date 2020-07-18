import { DocereConfig, Colors, ExtractedTextData, LayerType } from '@docere/common'

const config: DocereConfig = {
	slug: 'isidore',
	title: "Isidore's Ethymologiae",
	private: true,
	entities: [
		{
			color: Colors.BlueBright,
			id: 'gloss',
			extract: doc => Array.from(doc.querySelectorAll('gloss[corresp]'))
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
			extract: doc => doc.querySelector('text'),
			id: 'text',
			type: LayerType.Text,
		},
	]
}

export default config
