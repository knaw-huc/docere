const renameMap: [RegExp, string][] = [
	[new RegExp(/^NHA_1972/), 'RHC-NHA/1972'],
	[new RegExp(/^NAN_disk2/), 'NAN2/1.04.02'],
	[new RegExp(/^RHC_part2\//), ''],
	[new RegExp(/^RHC_part1\//), ''],
	[new RegExp(/^NAN_disk1/), 'NAN1/1.04.02'],
	[new RegExp(/^NHA_1617/), 'RHC-NHA/1617'],
]

export default function prepareDocument(doc: XMLDocument, _config: DocereConfig, id: string) {
	let jpgPath = id
	
	const found = renameMap.find(x => x[0].test(id))
	if (found != null) jpgPath = jpgPath.replace(found[0], found[1])

	// Exception for Tresoar because of a different dir structure
	if (/^RHC_part2\/RHC-Tresoar/.test(id)) {
		const sub = id.split('_').slice(-2, -1)[0]
		jpgPath = jpgPath.replace('/26/NL', `/26/${sub}/NL`)
	}

	const pb = doc.createElement('pb')
	pb.setAttribute('path', `${jpgPath}.jpg`)
	doc.documentElement.prepend(pb)

	for (const el of doc.querySelectorAll('String')) {
		el.textContent = el.getAttribute('CONTENT') + ' '
		el.removeAttribute('CONTENT')
	}

	return doc
}
