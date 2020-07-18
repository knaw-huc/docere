import { DocereConfig, EsDataType, LayerType } from '@docere/common'

const config: DocereConfig = {
	entrySettings: {
		"panels.text.showLineBeginnings": false,
		"panels.text.showPageBeginnings": false,
	},
	slug: 'plakaatboek-guyana-1670-1816',
	title: 'Plakaatboek Guyana 1670-1816',
	searchResultCount: 20,
	metadata: [
		{
			id: 'kolonie',
			order: 10,
		},
		{
			id: 'doctype',
			order: 20,
			title: 'Document type',
		},
		{
			id: 'date',
			datatype: EsDataType.Date,
			interval: 'y',
			order: 30,
			title: 'Datum',
		},
		{
			id: 'documentnr',
			showAsFacet: false,
		}
	],
	layers: [
		{
			extract: doc => doc.querySelector('transcriptie'),
			id: 'transcriptie',
			type: LayerType.Text,
		}
	]
}

export default config
