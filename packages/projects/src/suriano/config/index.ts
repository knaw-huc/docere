import { extendConfigData, LayerType, Colors, EntityType, xmlToString, EsDataType, DTAP } from '@docere/common'
import extractFacsimiles from './facsimiles'

export default extendConfigData({
	// collection: {
	// 	metadataId: 'filza',
	// 	sortBy: 'letterno',
	// },
	dtap: DTAP.Testing,
	documents: {
		remoteDirectories: [
			'suriano/letters',
		],
	},
	slug: 'suriano',
	title: "Suriano",
	private: true,
	metadata: [
		// {
		// 	id: 'summary',
		// 	extract: entry => entry.preparedElement.querySelector('div[type="summary"] > p').textContent
		// },
		{
			id: 'sender',
			extract: entry => entry.preparedElement.querySelector('correspAction[type="sent"] name').textContent
		},
		{
			id: 'sender_place',
			extract: entry => entry.preparedElement.querySelector('correspAction[type="sent"] settlement').textContent
		},
		{
			datatype: EsDataType.Date,
			extract: entry => entry.preparedElement.querySelector('correspAction[type="sent"] date')?.getAttribute('when'),
			id: 'sender_date',
			interval: 'y',
		},
		{
			id: 'filza',
			extract: entry => entry.preparedElement.querySelector('idno[type="filza"]').textContent
		},
		{
			id: 'letterno',
			extract: entry => entry.preparedElement.querySelector('idno[type="letterno"]').textContent
		},
		{
			id: 'settlement',
			extract: entry => entry.preparedElement.querySelector('msIdentifier > settlement').textContent
		},
		{
			id: 'insitution',
			extract: entry => entry.preparedElement.querySelector('msIdentifier > institution').textContent
		},
		{
			id: 'collection',
			extract: entry => entry.preparedElement.querySelector('msIdentifier > collection').textContent
		},
		{
			id: 'biblScope',
			extract: entry => entry.preparedElement.querySelector('biblScope').textContent
		},
	],
	layers: [
		{
			id: 'facsimile',
			type: LayerType.Facsimile,
		},
		{
			extractElement: entry => entry.preparedElement.querySelector('div[type="original"]'),
			id: 'text',
			type: LayerType.Text,
		},
		{
			extractElement: entry => entry.preparedElement.querySelector('div[type="summary"]'),
			id: 'summary',
			type: LayerType.Text,
		},
	],
	entities: [
		{
			color: Colors.BlueBright,
			id: 'note',
			extract: ({ layerElement, entityConfig, entry }) => Array.from(layerElement.querySelectorAll(entityConfig.selector))
				.map(el => {
					const n = el.getAttribute('n')
					const id = entityConfig.extractId(el)
					return {
						anchor: el,
						content: xmlToString(entry.preparedElement.querySelector(`note[*|id="${id}"]`)),
						n,
						title: `Note ${n}`,
					}
				}),
			extractId: el => el.getAttribute('target').slice(1),
			selector: 'ptr[target]',
			title: "Notes",
			type: EntityType.Note,
			showInAside: false,
			showAsFacet: false,
		},
		{
			color: Colors.Pink,
			id: 'personography',
			extract: ({ layerElement, entityConfig }) => Array.from(layerElement.querySelectorAll(entityConfig.selector))
				.map(el => ({
					anchor: el,
					content: el.getAttribute('key'),
				})),
			extractId: el => el.getAttribute('key'),
			selector: 'rs[type="pers"]',
			title: "Persons",
			type: EntityType.Person,
		},
	],
	facsimiles: {
		extractFacsimileId: el => el.getAttribute('xml:id'),
		extractFacsimiles,
		selector: 'pb',
	},
	pages: [
		{
			id: 'biblio',
			remotePath: 'suriano/pages/Biblio.xml',
			split: {
				extractId: (el) => el.getAttribute('xml:id'),
				selector: 'bibl',
			},
			title: 'Bibliography'
		},
		{
			id: 'personography',
			remotePath: 'suriano/pages/Personography.xml',
			split: {
				extractId: (el) => el.getAttribute('xml:id'),
				selector: 'person',
			},
			title: 'Personography'
		},
	],
})
