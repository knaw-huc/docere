import { ConfigEntry } from '@docere/common'
import type { Facsimile } from '@docere/common'

export default function extractFacsimiles(entry: ConfigEntry) {
	const facsimiles: Facsimile[] = Array.from(entry.document.querySelectorAll('column[facs]'))
		.reduce((prev, column) => {
			const id = column.getAttribute('facs')
			column.setAttribute('docere:id', id)
			if (!prev.some(p => p.id === id)) {
				prev.push({
					id,
					versions: [{
						path: `https://images.diginfra.net/iiif/${id}/info.json`
					}]
				})
			}
			return prev
		}, [])

	return facsimiles
}

