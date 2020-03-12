const prepareDocument: DocereConfigData['prepareDocument'] = function prepareDocument(doc) {
	const typeById: Map<string, string> = new Map()
	doc.querySelectorAll('w').forEach(el => {
		el.setAttribute('value', el.querySelector('t').textContent)
		el.setAttribute('contemporary', el.querySelector('t.contemporary').textContent)
		el.setAttribute('pos', el.querySelector('pos').getAttribute('class').replace(/\(.*\)/, ''))
		el.setAttribute('possub', el.querySelector('pos').getAttribute('class').replace(/\w+/, '').slice(1, -1).split(',').join(', '))
		el.id = el.getAttribute('xml:id')
		el.innerHTML = ''
	})
	doc.querySelectorAll('head > t').forEach(t => t.parentElement.removeChild(t))
	doc.querySelectorAll('p > t').forEach(t => t.parentElement.removeChild(t))
	doc.querySelectorAll('entity > wref').forEach(wref => {
		const rs = doc.createElement('rs')
		const type = wref.parentElement.getAttribute('class')
		rs.setAttribute('type', type)
		rs.setAttribute('xml:id', wref.id)
		rs.textContent = wref.getAttribute('t')
		doc.documentElement.appendChild(rs)
		typeById.set(wref.id, type)
	})
	doc.querySelectorAll('s > entities').forEach(t => t.parentElement.removeChild(t))

	for (const [id, type] of typeById) {
		const w = doc.getElementById(id)
		w.setAttribute('type', type)
	}

	return doc
}
export default prepareDocument
