import type { Facsimile } from '@docere/common'

export function formatTileSource(facsimile: Facsimile) {
	if (facsimile == null) return

	return {
		tileSource: facsimile.props._facsimilePath,
		width: 2,
		x: .5,
		y: .5,
	}
}
