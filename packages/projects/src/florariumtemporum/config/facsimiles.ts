import { ConfigEntry } from '@docere/common'

export default function extractFacsimiles(entry: ConfigEntry) {
	const pb = entry.element.querySelector('pb')
	const path = pb.getAttribute('path')
	return [
		{
			id: path, 
			versions: [{
				path
			}]
		}
	]
}
