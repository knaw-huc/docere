import { FacsimileType } from '@docere/common'
import type { Facsimile } from '@docere/common'

export function formatTileSource(facsimile: Facsimile) {
	let version = facsimile.versions[0]

	return (version.type === FacsimileType.Image) ?
		{
			tileSource: {
				type: 'image',
				url: version.path,
				buildPyramid: false
			}
		} :
		version.path
}
