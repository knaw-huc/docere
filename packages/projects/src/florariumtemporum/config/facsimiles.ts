import { ExtractFacsimiles } from '@docere/common'

export default (function extractFacsimiles({ layerElement }) {
	const pb = layerElement.querySelector('pb')
	const path = pb.getAttribute('path')
	return [
		{
			anchor: pb,
			id: path, 
			versions: [{
				path
			}]
		}
	]
}) as ExtractFacsimiles
