function byteToHex(byte: number) {
	const hex = ('0' + byte.toString(16)).slice(-2);
	return hex
}

function generateId(len = 10) {
	var arr = new Uint8Array((len || 40) / 2);
	window.crypto.getRandomValues(arr);
	const tail = [].map.call(arr, byteToHex).join("");
	const head = String.fromCharCode(97 + Math.floor(Math.random() * 26))
	return `${head}${tail}`
}

export default function prepareDocument(doc: XMLDocument, _config: DocereConfig) {
	for (const note of doc.querySelectorAll(`div[type="textualNotes"] note`)) {
		note.id = generateId()
	}

	for (const note of doc.querySelectorAll(`div[type="notes"] note`)) {
		note.id = note.getAttribute('target').slice(1)
	}

	return doc
}
