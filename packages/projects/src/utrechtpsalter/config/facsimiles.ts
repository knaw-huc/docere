import type { FacsimileArea, Facsimile, ConfigEntry } from '@docere/common'

function extractFacsimileAreas(doc: XMLDocument) {
	const areas: FacsimileArea[] = []

	for (const coords of doc.querySelectorAll('coords')) {
		// const id = str.getAttribute('area')
		// const [x, y, w, h] = parseArea(id)
		const x = coords.getAttribute('x')
		const y = coords.getAttribute('y')
		const w = coords.getAttribute('w')
		const h = coords.getAttribute('h')
		const id = x + y + w + h
		// console.log(id)

		areas.push({
			id,
			x: parseFloat(x),
			y: parseFloat(y),
			w: parseFloat(w),
			h: parseFloat(h),
			unit: 'perc'
		})
	}

	return areas
}

export default function extractFacsimiles(entry: ConfigEntry) {
	const facsimiles: Facsimile[] = []
	const facsimile = entry.document.querySelector('imgLocation')

	if (facsimile) {
		facsimiles.push({
			id: facsimile.textContent,
			versions: [{
				areas: extractFacsimileAreas(entry.document),
				path: `https://objects.library.uu.nl/fcgi-bin/iipsrv.fcgi?IIIF=/manifestation/viewer${facsimile.textContent.slice(0, -4)}.jp2/info.json`
			}]
		})
	}

	return facsimiles
}
