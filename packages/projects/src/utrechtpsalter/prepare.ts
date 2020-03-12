export default function prepareDocument(doc: XMLDocument, config: DocereConfig, id: string) {
	const page = config.data.pages.find((p: any) => p.id === parseInt(id, 10) - 1)

	if (page != null) {
		const section = doc.querySelector('section')
		const imgLocation = doc.createElement('imgLocation')
		imgLocation.textContent = page.imgLocation
		section.prepend(imgLocation)
	}

	doc.querySelectorAll('block').forEach(block => {
		block.setAttribute('class', 'block')
	})

	doc.querySelectorAll('coords').forEach(coords => {
		const x = coords.querySelector('x')
		coords.setAttribute('x', x.textContent)
		coords.removeChild(x)

		const y = coords.querySelector('y')
		coords.setAttribute('y', y.textContent)
		coords.removeChild(y)

		const w = coords.querySelector('w')
		coords.setAttribute('w', w.textContent)
		coords.removeChild(w)

		const h = coords.querySelector('h')
		coords.setAttribute('h', h.textContent)
		coords.removeChild(h)
	})

	return doc
}
