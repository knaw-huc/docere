// import { ExtractedEntry } from '@docere/common'

// export default function prepareDocument(entry: ExtractedEntry) {
// 	// Add <pb>s
// 	for (const span of entry.document.querySelectorAll('span.span0')) {
// 		// Find the span's with textContent "\ 100r \" or "\ 102v \"
// 		if (/^\/\s?\d\d\d(r|v)\s?\/\s?/.test(span.textContent)) {
// 			const [,id] = /.*(\d\d\d(r|v)).*/.exec(span.textContent)
// 			const pb = entry.document.createElement('pb')
// 			pb.id = id
// 			span.parentNode.replaceChild(pb, span)
// 		}
// 	}

// 	// Add <lb>s
// 	for (const span of entry.document.querySelectorAll('p > span')) {
// 		span.innerHTML = span.innerHTML.replace(/\|/g, '<lb />')
// 	}

// 	return entry.document.documentElement
// }
