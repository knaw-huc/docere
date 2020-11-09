import { ConfigEntry } from '@docere/common'
import type { Facsimile } from '@docere/common'

export default function extractFacsimiles(entry: ConfigEntry) {
	const facsimiles: Facsimile[] = Array.from(entry.document.querySelectorAll('column[facs]'))
		.map(column => {
			const id = column.getAttribute('facs')
			return {
				id,
				versions: [{
					path: `https://images.diginfra.net/iiif/${id}/info.json`
				}]
			}
		})

	return facsimiles
}

