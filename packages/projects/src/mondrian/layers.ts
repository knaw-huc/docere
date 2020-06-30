export default function extractTextLayers(doc: XMLDocument) {
	const original = doc.querySelector('div[type="original"]')
	// const translation = doc.querySelector('div[type="translation"]')

	return [
		{
			element: original,
			id: 'original',
		},
		// {
		// 	element: translation,
		// 	id: 'translation',
		// }
	]
}
