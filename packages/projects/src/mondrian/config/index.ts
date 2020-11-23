import { extendConfigData, EsDataType, Colors, EntityType, LayerType, xmlToString } from '@docere/common'
import { extractLayerElement } from '../../utils'
import extractFacsimiles from './facsimiles'

export default extendConfigData({
	metadata: [
		{
			datatype: EsDataType.Date,
			extract: entry => entry.document.querySelector('correspAction[type="sent"] > date')?.getAttribute('when'),
			id: 'date',
			interval: 'y',
			order: 10,
		},
		{
			extract: entry => entry.document.querySelector('correspAction[type="sent"] > name')?.textContent,
			id: 'author',
			order: 20,
		},
		{
			id: 'addressee',
			extract: entry => entry.document.querySelector('correspAction[type="received"] > name')?.textContent,
			order: 30,
		},
		{
			extract: entry => entry.document.querySelector('correspAction[type="sent"] > placeName')?.textContent,
			id: 'place',
			order: 40,
		},
		{
			extract: entry => entry.id.slice(0, 7) === 'brieven' ? 'brief' : 'geschrift',
			id: 'type',
			order: 15,
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
		},
		{
			datatype: EsDataType.Boolean,
			extract: entry => entry.document.querySelector('div[type="translation"]')?.textContent.trim().length > 0,
			id: 'hasTranslation',
		}
	],
	entities: [
		{
			color: Colors.Green,
			id: 'rkd-artwork-link',
			type: EntityType.Artwork,
			extract: ({ entry, entityConfig }) => Array.from(entry.preparedElement.querySelectorAll(entityConfig.selector))
				.map(x => ({
					anchors: [x],
					content: x.textContent,
				})),
			extractId: el => el.getAttribute('key'),
			order: 80,
			selector: 'rs[type="artwork-m"][key]',
		},
		{
			color: Colors.Blue,
			id: 'biblio',
			type: EntityType.PagePart,
			extract: ({ entityConfig, entry }) => Array.from(entry.preparedElement.querySelectorAll(entityConfig.selector))
				.map(x => ({
					anchors: [x],
					content: x.textContent,
				})),
			extractId: el => el.getAttribute('target').split('#')[1],
			order: 90,
			selector: 'ref[target^="biblio.xml#"]',
		},
		{
			color: Colors.Green,
			id: 'bio',
			type: EntityType.PagePart,
			extractId: el => el.getAttribute('target').split('#')[1],
			extract: ({ entry, entityConfig }) => Array.from(entry.preparedElement.querySelectorAll(entityConfig.selector))
				.map(x => ({
					anchors: [x],
					content: x.textContent,
				})),
			order: 70,
			selector: 'ref[target^="bio.xml#"]',
		},
		{
			color: Colors.Blue,
			id: 'editor',
			extractId: el => el.getAttribute('target')?.slice(1),
			extract: ({ layerElement, entry, entityConfig }) =>
				Array.from(layerElement.querySelectorAll(entityConfig.selector))
					.map((ptr, index) => {
						const id = ptr.getAttribute('docere:id')
						const note = entry.preparedElement.querySelector(`note[*|id="${id}"]`)
						return {
							anchors: [ptr],
							content: xmlToString(note),
							n: (index + 1).toString(),
							title: 'Note',
						}
					}),
			type: EntityType.Note,
			selector: 'ptr[type="note"][target]',
			showAsFacet: false
		}
	],
	facsimiles: {
		extractFacsimileId: el => el.getAttribute('facs')?.slice(1),
		extractFacsimiles,
		selector: 'pb[facs]',
	},
	layers: [
		{
			id: 'facsimile',
			type: LayerType.Facsimile,
		},
		{
			id: 'original',
			extractElement: extractLayerElement('div[type="original"]'),
			type: LayerType.Text,
		},
		{
			id: 'translation',
			extractElement: extractLayerElement('div[type="translation"]'),
			type: LayerType.Text,
		}
	],
	documents: {
		remoteDirectories: [
			'mondrian/editie-conversie/geschriften',
			'mondrian/editie-conversie/brieven/04_Transcriptie_DEF'
		],
	},
	pages: [
		{
			id: 'biblio',
			remotePath: 'mondrian/editie/apparaat/biblio.xml',
			split: {
				extractId: (el) => el.getAttribute('xml:id'),
				selector: 'bibl',
			},
			title: 'Bibliography'
		},
		{
			id: 'bio',
			remotePath: 'mondrian/editie/apparaat/bio.xml',
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
