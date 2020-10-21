import { ConfigEntry } from '@docere/common'
import type { DocereConfig, Facsimile } from '@docere/common'

// function parseArea(id: string)  {
// 	return id
// 		.split('_')
// 		.map(x => parseInt(x, 10))
// }

// function elementToArea(el: Element): FacsimileArea {
// 	const id = el.getAttribute('id')
// 	const area = el.getAttribute('area')
// 	const [x, y, w, h] = parseArea(area)
// 	return { id, x, y, w, h }
// }

// function extractFacsimileAreas(doc: XMLDocument, config: DocereConfig) {
// 	const areas: FacsimileArea[] = []

// 	for (const el of doc.querySelectorAll('string')) {
// 		const area = elementToArea(el)
// 		area.showOnHover = false
// 		area.note = { ocr: el.textContent }
// 		if (el.hasAttribute('suggestion')) area.note.suggestion = el.getAttribute('suggestion')

// 		if (el.hasAttribute('ref')) {
// 			const type = el.getAttribute('type').split(' ')[0]
// 			const textDataConfig = config.entities.find(td => td.id === type)
// 			if (textDataConfig == null) console.log(`[extractFacsimileAreas] No config found for: ${type}`)

// 			area.target = {
// 				color: textDataConfig?.color,
// 				id: el.getAttribute('ref'),
// 				listId: type,
// 				asideTab: AsideTab.TextData,
// 			}
// 		}

// 		areas.push(area)
// 	}

// 	for (const el of doc.querySelectorAll('block')) {
// 		const area = elementToArea(el)
// 		area.showOnHover = false
// 		areas.push(area)
// 	}

// 	for (const el of doc.querySelectorAll('line')) {
// 		const area = elementToArea(el)
// 		area.note = { ocr: el.textContent }
// 		areas.push(area)
// 	}

// 	return areas
// }

export default function extractFacsimiles(entry: ConfigEntry, _config: DocereConfig) {
	const facsimiles: Facsimile[] = []
	const pb = entry.document.querySelector('pb')

	facsimiles.push({
		id: pb.getAttribute('path'),
		versions: [{
			// areas: extractFacsimileAreas(entry.document, config),
			path: `https://demo.docere.diginfra.net/iiif/gheys/${pb.getAttribute('path')}/info.json`,
		}]
	})

	return facsimiles
}

