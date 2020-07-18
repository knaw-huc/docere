import { DocereConfig, EsDataType, RsType, Colors, LayerType } from '@docere/common'

const config: DocereConfig = {
	slug: 'mondrian',
	title: 'The Mondrian Papers',
	private: true,
	metadata: [
		{
			id: 'date',
			datatype: EsDataType.Date,
			interval: 'y',
		}
	],
	pages: [
		{
			id: 'biblio',
			split: {
				extractId: (el) => el.getAttribute('xml:id'),
				selector: 'bibl',
			},
			title: 'Bibliography'
		},
		{
			id: 'bio',
			split: {
				extractId: (el) => el.getAttribute('xml:id'),
				selector: 'person',
			},
			title: 'Biographies'
		},
	],
	entities: [
		{
			color: Colors.Blue,
			id: 'biblio',
			type: RsType.PagePart,
			extract: doc => Array.from(doc.querySelectorAll('ref[target^="biblio.xml#"]'))
				.map(x => ({
					id: x.getAttribute('target').split('#')[1],
					value: x.textContent,
				})),
		},
		{
			color: Colors.Green,
			id: 'bio',
			type: RsType.PagePart,
			extract: doc => Array.from(doc.querySelectorAll('ref[target^="bio.xml#"]'))
				.map(x => ({
					id: x.getAttribute('target').split('#')[1],
					value: x.textContent,
				})),
		},
		{
			color: Colors.Green,
			id: 'rkd-artwork-link',
			type: RsType.Artwork,
			extract: doc => Array.from(doc.querySelectorAll('rs[type="artwork-m"]'))
				.map(x => ({
					id: x.getAttribute('key'),
					value: x.textContent,
				})),
		}
	],
	layers: [
		{
			id: 'original',
			extract: doc => doc.querySelector('div[type="original"]'),
			type: LayerType.Text,
		},
		{
			id: 'translation',
			extract: doc => doc.querySelector('div[type="translation"]'),
			type: LayerType.Text,
		}
	],
	notes: [
		{
			color: Colors.Blue,
			id: 'editor',
			extract: doc =>
				Array.from(doc.querySelectorAll('div[type="notes"] > note'))
					.map((el, index) => ({
						element: el,
						id: el.getAttribute('xml:id'),
						n: (index + 1).toString(),
						title: 'Note',
					}))
		}
	]
}

export default config
