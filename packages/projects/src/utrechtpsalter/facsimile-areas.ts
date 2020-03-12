export default function extractFacsimileAreas(doc: XMLDocument, _config: DocereConfig) {
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
