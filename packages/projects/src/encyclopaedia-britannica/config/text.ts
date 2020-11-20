import { ExtractedEntry } from '@docere/common'

export default function(entry: ExtractedEntry) {
	return Array.from(entry.document.querySelectorAll('String,SP'))
		.reduce((prev, curr) => {
			if (curr.nodeName === 'String') return `${prev}${curr.getAttribute('CONTENT')}`
			else return `${prev} `
		}, '')
}
