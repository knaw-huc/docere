import { EsDataType } from '@docere/common'
import type { ExtractedEntry, DocereConfig } from '@docere/common'

function extractMetadata(entry: ExtractedEntry, selector: string) {
	function nsResolver(prefix: string): string {
		return prefix === 'vg' ?  "http://www.vangoghletters.org/ns/" : "http://www.tei-c.org/ns/1.0"
	} 

	const metadataRoot = entry.document.querySelector('sourceDesc')
	const iterator = entry.document.evaluate(selector, metadataRoot, nsResolver as any, XPathResult.ANY_TYPE, null)
	const el = iterator.iterateNext()

	if (!el) {
		console.log(`Selector not found: ${selector}`)
		return
	}

	return el.textContent
}

const metadata: DocereConfig['metadata'] = [
	{
		extract: entry => extractMetadata(entry, '//dummy:author'),
		id: 'author',
		order: 100,
	},
	{
		extract: entry => extractMetadata(entry, '//vg:addressee'),
		id: 'addressee',
		order: 200,
	},
	{
		extract: entry => extractMetadata(entry, "//dummy:note[@type='date']"),
		id: 'date',
		order: 300,
		showAsFacet: false
	},
	{
		extract: entry => extractMetadata(entry, '//vg:placeLet'),
		id: 'placelet',
		title: 'Place',
	},
	{
		extract: entry => extractMetadata(entry, '//vg:letContents'),
		id: 'letcontents',
		datatype: EsDataType.Text,
		title: 'Summary',
	},
	{
		extract: entry => entry.document.querySelector('figure') != null,
		id: 'has_figure',
		datatype: EsDataType.Boolean,
		title: 'Has figure'
	},
	// {
	// 	id: 'pers',
	// 	title: 'Person',
	// },
	{
		extract: entry => extractMetadata(entry, '//vg:dateLet'),
		id: 'datelet',
		title: 'Date',
	},
	{
		extract: entry => extractMetadata(entry, "//dummy:note[@type='location']"),
		id: 'sourcestatus',
		title: 'Status',
	},
	{
		extract: entry => extractMetadata(entry, "//dummy:note[@type='sourceStatus']"),
		id: 'location',
		title: 'Current location',
	}
]

export default metadata
