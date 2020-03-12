import { LayerType } from '@docere/common'

export default function extractTextLayers(doc: XMLDocument, config: DocereConfig) {
	const element = doc.querySelector('text')

	return config.layers
		.filter(tl => tl.type === LayerType.Text)
		.map(tl => ({
			element,
			id: tl.id
		}))
}
