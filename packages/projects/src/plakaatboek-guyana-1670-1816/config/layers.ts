// import type { ExtractedLayer } from '@docere/common'

export default function extractTextLayers(doc: XMLDocument) {
	// const element = doc.querySelector('text#OpdDD body')
	// const layers = Array.from(doc.querySelectorAll('text#OpdDD witness'))
	// 	.map(witness => ({
	// 		element,
	// 		id: witness.getAttribute('n'),
	// 		title: witness.textContent.slice(0, 4)
	// 	}))

	return [{
		element: doc.querySelector('transcriptie'),
		id: 'transcriptie'
	}]
}
