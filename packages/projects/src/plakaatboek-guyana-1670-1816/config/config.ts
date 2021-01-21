import { DocereConfig, EsDataType, LayerType } from '@docere/common'
import { extractLayerElement } from '../../utils'
import prepare from './prepare'

const projectId = 'plakaatboek-guyana-1670-1816'

const config: DocereConfig = {
	entrySettings: {
		"panels.text.showLineBeginnings": false,
		"panels.text.showPageBeginnings": false,
	},
	slug: projectId,
	title: 'Plakaatboek Guyana 1670-1816',
	searchResultCount: 20,
	metadata: [
		{
			extract: entry => Array.from(entry.document.querySelectorAll('kolonie > kolonie_')).map(k => k.textContent),
			id: 'kolonie',
			order: 10,
		},
		{
			extract: entry => entry.document.querySelector('doctype > doctype')?.textContent,
			id: 'doctype',
			order: 20,
			title: 'Document type',
		},
		{
			extract: entry => {
				const date: number[] = []
				for (let i = 0; i < 3; i++) {
					const prop = `date${i + 1}`
					const dateElement = entry.document.querySelector(prop)
					const year = dateElement.querySelector('year')?.textContent
					const month = dateElement.querySelector('month')?.textContent
					const day = dateElement.querySelector('day')?.textContent

					if (year.length && month.length && day.length) date.push(new Date(`${year}-${month}-${day}`).getTime())
				}
				return date
			},
			id: 'date',
			datatype: EsDataType.Date,
			interval: 'y',
			order: 30,
			title: 'Datum',
		},
		{
			extract: entry => entry.document.querySelector('plakkaat > documentnr')?.textContent,
			id: 'documentnr',
			showAsFacet: false,
		},
		{

			id: 'uitgevende_instantie',
			extract: entry => entry.document.querySelector('uitgevende_instantie')?.textContent,
		},
		{
			id: 'plaats_opmaak',
			extract: entry => entry.document.querySelector('plaats_opmaak')?.textContent,
		},
		{
			id: 'keyword_subject',
			extract: entry => Array.from(entry.document.querySelectorAll('keyword_subject > onderwerp')).map(k => k.textContent),
		}
	],
	layers: [
		{
			extractElement: extractLayerElement('transcriptie'),
			id: 'transcriptie',
			type: LayerType.Text,
		}
	],
	prepare
}

export default config
