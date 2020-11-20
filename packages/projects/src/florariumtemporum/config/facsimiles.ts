export default function extractFacsimiles(layerElement: Element) {
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
}
