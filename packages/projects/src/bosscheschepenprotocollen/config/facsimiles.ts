import { ExtractFacsimiles } from '@docere/common'

export default (function extractFacsimiles({ layerElement }) {
	return Array.from(layerElement.querySelectorAll('pb[n]'))
		.reduce((prev, pb) => {
			const ids = pb.getAttribute('n')

			for (const id of ids.split(' ')) {
				const [n, rv]  = id.split(/(\w)$/)

				// @ts-ignore
				const paddedN = n.padStart(3, '0')

				const imgBase = encodeURIComponent(`1661/1661_${paddedN}-${rv.toUpperCase()}`)
				const path = `/iiif/bosscheschepenprotocollen/${imgBase}.jpg/info.json`

				prev.push({
					anchors: [pb],
					id,
					versions: [{ path }]
				})
			}

			return prev
		}, [])
}) as ExtractFacsimiles

