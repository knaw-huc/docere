import { DocereConfig, EsDataType, SortBy, SortDirection, LayerType, Colors, EntityType, xmlToString } from '@docere/common'
import { extractLayerElement } from '../../utils'
import extractFacsimiles from './facsimiles'

const config: DocereConfig = {
	entrySettings: {
		"panels.text.showLineBeginnings": false,
	// 	"panels.text.showPageBeginnings": false,
	},
	collection: {
		metadataId: 'regio',
		sortBy: 'n'
	},
	slug: 'henegouwseregisters',
	title: 'Registers van de Hollandse grafelijkheid 1299-1345',
	searchResultCount: 20,

	metadata: [
		{
			extract: entry => entry.id.split('/')[0],
			id: 'regio',
			order: 5,
			size: 20,
			sort: {
				by: SortBy.Key,
				direction: SortDirection.Asc
			}
		},
		{
			extract: entry => entry.id.split('_')[0],
			id: 'regiocode',
		},
		{
			extract: entry => entry.id.split('_')[1],
			id: 'n',
		},
		{
			extract: entry => {
				const dateElement = entry.document.querySelector('datum')
				const year = dateElement.querySelector('year')?.textContent
				const month = dateElement.querySelector('month')?.textContent
				const day = dateElement.querySelector('day')?.textContent
				return (year.length && month.length && day.length) ?
					new Date(`${year}-${month}-${day}`).getTime() :
					null
			},
			id: 'datum',
			datatype: EsDataType.Date,
			interval: 'y',
			order: 7,
		},
		{
			extract: entry => Array.from(entry.document.querySelectorAll('register')).map(k => k.textContent.slice(0, k.textContent.indexOf(' ('))).filter(x => x.length > 0),
			id: 'register_code',
			order: 10,
		},
		{
			extract: entry => Array.from(entry.document.querySelectorAll('register')).map(k => k.textContent).filter(x => x.length > 0),
			id: 'register',
			order: 20,
		},
	],
	entities: [
		{
			color: Colors.BlueBright,
			id: 'editor',
			extract: ({ layerElement, entityConfig }) => Array.from(layerElement.querySelectorAll(entityConfig.selector))
				.map((element, index) => ({
					anchors: [element],
					content: xmlToString(element),
					n: (index + 1).toString(),
				})),
			extractId: el => el.id,
			selector: 'note',
			type: EntityType.Note,
		}
	],
	facsimiles: {
		extractFacsimileId: el => el.id, /* TODO fix */
		extractFacsimiles,
		selector: 'register',
	},
	layers: [
		{
			active: true,
			id: 'facsimile',
			title: 'Facsimile',
			type: LayerType.Facsimile
		},
		{
			extractElement: extractLayerElement('transcriptie'),
			id: 'transcriptie',
			type: LayerType.Text,
		}
	]
}

export default config
