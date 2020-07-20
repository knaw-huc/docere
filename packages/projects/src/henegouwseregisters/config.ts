import { DocereConfig, EsDataType, SortBy, SortDirection, LayerType, ExtractedNote, Colors } from '@docere/common'
import { extractLayerElement } from '../utils'

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
			id: 'regio',
			order: 5,
			size: 20,
			sort: {
				by: SortBy.Key,
				direction: SortDirection.Asc
			}
		},
		{
			id: 'datum',
			datatype: EsDataType.Date,
			interval: 'y',
			order: 7,
		},
		{
			id: 'register_code',
			order: 10,
		},
		{
			id: 'register',
			order: 20,
		},
	],
	notes: [
		{
			color: Colors.BlueBright,
			id: 'editor',
			extract: entry => Array.from(entry.document.querySelectorAll('note'))
				.map((element, index): ExtractedNote => ({
					element,
					id: element.id,
					n: (index + 1).toString(),
				}))
		}
	],
	layers: [
		{
			active: true,
			id: 'facsimile',
			title: 'Facsimile',
			type: LayerType.Facsimile
		},
		{
			extract: extractLayerElement('transcriptie'),
			id: 'transcriptie',
			type: LayerType.Text,
		}
	]
}

export default config
