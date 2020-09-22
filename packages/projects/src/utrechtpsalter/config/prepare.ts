import type { DocereConfig, ConfigEntry } from '@docere/common'

export default function prepareDocument(entry: ConfigEntry, config: DocereConfig) {
	const page = config.data.pages.find((p: any) => p.id === parseInt(entry.id, 10) - 1)

	if (page != null) {
		const section = entry.document.querySelector('section')
		const imgLocation = entry.document.createElement('imgLocation')
		imgLocation.textContent = page.imgLocation
		section.prepend(imgLocation)
	}

	entry.document.querySelectorAll('transcription').forEach(transcription => {
		transcription.setAttribute('lang', transcription.querySelector('lang').textContent)
	})

	entry.document.querySelectorAll('block').forEach(block => {
		block.setAttribute('class', 'block')
	})

	entry.document.querySelectorAll('coords').forEach(coords => {
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

	return entry.document.documentElement
}
