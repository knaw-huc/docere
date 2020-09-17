import type { FacsimileArea, DocereConfig, Facsimile, Entry } from '@docere/common'

function elementToArea(el: Element): FacsimileArea {
	return {
		id: el.getAttribute('ID'),
		x: parseInt(el.getAttribute('HPOS'), 10),
		y: parseInt(el.getAttribute('VPOS'), 10),
		w: parseInt(el.getAttribute('WIDTH'), 10),
		h: parseInt(el.getAttribute('HEIGHT'), 10)
	}
}

function extractFacsimileAreas(doc: XMLDocument, _config: DocereConfig) {
	const areas: FacsimileArea[] = []

	for (const el of doc.querySelectorAll('String')) {
		const area = elementToArea(el)
		area.showOnHover = false
		area.target = { id: el.getAttribute('ID') }
		areas.push(area)
	}

	for (const el of doc.querySelectorAll('TextLine')) {
		const area = elementToArea(el)
		area.note = { ocr: el.textContent }
		areas.push(area)
	}

	return areas
}

export default function extractFacsimiles(entry: Entry, config: DocereConfig) {
	const facsimiles: Facsimile[] = []

	const [,id2] = entry.id.split('/alto/')
	const path = id2.slice(0, 4) + '/' + id2.slice(4, 8) + '/' + id2.slice(0, 9) + '.5'

	facsimiles.push({
		id: path,
		versions: [{
			areas: extractFacsimileAreas(entry.document, config),
			path: `http://localhost:4000/iiif/encyclopaedia-britannica/${path}/info.json`,
			// path: `https://view.nls.uk/iiif/${path}/info.json`,
		}]
	})

	return facsimiles
}

