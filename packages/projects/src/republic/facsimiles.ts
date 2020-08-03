import { Entry } from '@docere/common'
import type { Facsimile } from '@docere/common'

export default function extractFacsimiles(entry: Entry) {
	const facsimiles: Facsimile[] = []

	const id = `https://images.diginfra.net/iiif/${entry.id.replace(/\.page$/, '')}`

	facsimiles.push({
		id,
		versions: [{
			// areas: extractFacsimileAreas(entry.document, config),
			path: `${id}/info.json`,
		}]
	})

	return facsimiles
}

