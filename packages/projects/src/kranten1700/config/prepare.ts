import type { ConfigEntry } from '@docere/common'

export default function prepareDocument(entry: ConfigEntry) {
	const typeById: Map<string, string> = new Map()
	entry.document.querySelectorAll('w').forEach(el => {
		el.setAttribute('value', el.querySelector('t').textContent)
		el.setAttribute('contemporary', el.querySelector('t.contemporary').textContent)
		el.setAttribute('pos', el.querySelector('pos').getAttribute('class').replace(/\(.*\)/, ''))
		el.setAttribute('possub', el.querySelector('pos').getAttribute('class').replace(/\w+/, '').slice(1, -1).split(',').join(', '))
		el.id = el.getAttribute('xml:id')
		el.innerHTML = ''
	})
	entry.document.querySelectorAll('head > t').forEach(t => t.parentElement.removeChild(t))
	entry.document.querySelectorAll('p > t').forEach(t => t.parentElement.removeChild(t))
	entry.document.querySelectorAll('entity > wref').forEach(wref => {
		const rs = entry.document.createElement('rs')
		const type = wref.parentElement.getAttribute('class')
		rs.setAttribute('type', type)
		rs.setAttribute('xml:id', wref.id)
		rs.textContent = wref.getAttribute('t')
		entry.document.documentElement.appendChild(rs)
		typeById.set(wref.id, type)
	})
	entry.document.querySelectorAll('s > entities').forEach(t => t.parentElement.removeChild(t))

	for (const [id, type] of typeById) {
		const w = entry.document.getElementById(id)
		w.setAttribute('type', type)
	}

	return entry.document.documentElement
}
