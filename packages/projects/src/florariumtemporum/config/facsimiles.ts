import { ExtractFacsimiles } from '@docere/common'

export default (function extractFacsimiles({ layerElement }) {
	const pb = layerElement.querySelector('pb')
	const path = pb.getAttribute('path')
	return [
		{
			id: path, 
			path
		}
	]
}) as ExtractFacsimiles
