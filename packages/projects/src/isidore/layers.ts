export default function extractTextLayers(doc: XMLDocument) {
	return [
		{
			element: doc.querySelector('text'),
			id: 'text',
		},
	]
}
