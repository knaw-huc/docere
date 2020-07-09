export default function extractTextLayers(doc: XMLDocument) {
	return [
		{
			element: doc.querySelector('div[type="original"]'),
			id: 'original',
		},
		{
			element: doc.querySelector('div[type="translation"]'),
			id: 'translation',
		},
	]
}
