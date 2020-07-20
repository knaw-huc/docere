import type { ExtractedMetadata, Entry } from '@docere/common'

export default function extractMetadata(entry: Entry) {
	const metadata: ExtractedMetadata = {}

	const selectors = [
		'//dummy:author',
		'//vg:addressee',
		'//vg:letContents',
		'//vg:placeLet',
		'//vg:dateLet',
		"//dummy:note[@type='location']",
		"//dummy:note[@type='sourceStatus']",
		"//dummy:note[@type='date']",
	]

	function nsResolver(prefix: string): string {
		return prefix === 'vg' ?  "http://www.vangoghletters.org/ns/" : "http://www.tei-c.org/ns/1.0"
	} 

	selectors.forEach(selector => {
		const metadataRoot = entry.document.querySelector('sourceDesc')
		const iterator = entry.document.evaluate(selector, metadataRoot, nsResolver as any, XPathResult.ANY_TYPE, null)
		const el = iterator.iterateNext()

		if (el) {
			let key
			const re = /\/\/\w+:\w+\[@\w+='(\w+)'\]/
			if (re.test(selector)) {
				[,key] = re.exec(selector)
			} else {
				const re2 = /\/\/\w+:(\w+)/;
				[,key] = re2.exec(selector)
			}

			metadata[key.toLowerCase()] = el.textContent
		} else {
			console.log(`Selector not found: ${selector}`)
		}
	})

	metadata.has_figure = entry.document.querySelector('figure') != null

	return metadata
}
