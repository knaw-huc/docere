import { ExtractFacsimiles } from '@docere/common'

export default (function extractFacsimiles({ layerElement }) {
	const pb = layerElement.querySelector('pb')
	const path = pb.getAttribute('path')
	return [
		{
			anchors: [pb],
			id: path, 
			versions: [{
				path
			}]
		}
	]
}) as ExtractFacsimiles
