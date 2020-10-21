import { extendConfigData, EsDataType, Colors, EntityType, LayerType } from '@docere/common'
import { extractLayerElement, useAll } from '../../utils'
import extractFacsimiles from './facsimiles'

export default extendConfigData({
	facsimiles: {
		extract: extractFacsimiles
	},
	metadata: [
		{
			datatype: EsDataType.Date,
			extract: entry => entry.document.querySelector('correspAction[type="sent"] > date')?.getAttribute('when'),
			id: 'date',
			interval: 'y',
		},
		{
			extract: entry => entry.document.querySelector('correspAction[type="sent"] > name')?.textContent,
			id: 'author',
		},
		{
			id: 'addressee',
			extract: entry => entry.document.querySelector('correspAction[type="received"] > name')?.textContent,
		},
		{
			extract: entry => entry.document.querySelector('correspAction[type="sent"] > placeName')?.textContent,
			id: 'place',
		},
		{
			extract: entry => entry.id.slice(0, 7) === 'brieven' ? 'brief' : 'geschrift',
			id: 'type',
		},
		{
			extract: entry => entry.document.querySelectorAll('div[type="notes"] > note').length,
			id: 'noteCount',
		},
		{
			extract: entry => entry.document.querySelectorAll('div[type="ogtnotes"] > note').length,
			id: 'ogtNoteCount',
		},
		{
			extract: entry => entry.document.querySelectorAll('div[type="typednotes"] > note').length,
			id: 'typedNoteCount',
		}
	],
	entities: [
		{
			color: Colors.Blue,
			id: 'biblio',
			type: EntityType.PagePart,
			extract: entry => Array.from(entry.document.querySelectorAll('ref[target^="biblio.xml#"]'))
				.map(x => ({
					id: x.getAttribute('target').split('#')[1],
					content: x.textContent,
				})),
		},
		{
			color: Colors.Green,
			id: 'bio',
			type: EntityType.PagePart,
			extract: entry => Array.from(entry.document.querySelectorAll('ref[target^="bio.xml#"]'))
				.map(x => ({
					id: x.getAttribute('target').split('#')[1],
					content: x.textContent,
				})),
		},
		{
			color: Colors.Green,
			id: 'rkd-artwork-link',
			type: EntityType.Artwork,
			extract: entry => Array.from(entry.document.querySelectorAll('rs[type="artwork-m"]'))
				.map(x => ({
					id: x.getAttribute('key'),
					content: x.textContent,
				})),
		},
		{
			color: Colors.Blue,
			id: 'editor',
			extract: entry =>
				Array.from(entry.document.querySelectorAll('div[type="notes"] > note'))
					.map((el, index) => ({
						content: el.outerHTML,
						id: el.getAttribute('xml:id'),
						n: (index + 1).toString(),
						title: 'Note',
					})),
			type: EntityType.Note,
		}
	],
	layers: [
		{
			filterFacsimiles: useAll,
			id: 'facsimile',
			type: LayerType.Facsimile,
		},
		{
			id: 'original',
			extract: extractLayerElement('div[type="original"]'),
			type: LayerType.Text,
		},
		{
			id: 'translation',
			extract: extractLayerElement('div[type="translation"]'),
			filterFacsimiles: useAll,
			type: LayerType.Text,
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
	private: true,
	slug: 'mondrian',
	title: 'The Mondrian Papers',
})
