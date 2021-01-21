import { extendConfigData, EsDataType, LayerType } from '@docere/common'
import extractFacsimiles from './facsimiles'

const projectId = 'bosscheschepenprotocollen'

export default extendConfigData({
	facsimiles: {
		extractFacsimileId: el => el.getAttribute('n'),
		extractFacsimiles,
		selector: 'pb[n]'
	},
	metadata: [
		{
			datatype: EsDataType.Date,
			extract: entry => entry.preparedElement.querySelector('date')?.getAttribute('value'),
			id: 'date',
			interval: 'y',
			order: 10,
		},
		{
			extract: entry => Array.from(entry.preparedElement.querySelectorAll('person')).map(x => x.textContent),
			id: 'schepen',
			order: 20,
		},
	],
	layers: [
		{
			id: 'facsimile',
			type: LayerType.Facsimile,
		},
		{
			id: 'original',
			type: LayerType.Text,
		},
	],
	// documents: {
	// 	remoteDirectories: [
	// 		'mondrian/editie-conversie/geschriften',
	// 		'mondrian/editie-conversie/brieven/04_Transcriptie_DEF'
	// 	],
	// },
	private: true,
	slug: projectId,
	title: 'Bossche Schepenprotocollen',
})
