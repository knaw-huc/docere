export default function(doc: XMLDocument) {
	return Array.from(doc.querySelectorAll('String,SP'))
		.reduce((prev, curr) => {
			if (curr.nodeName === 'String') return `${prev}${curr.getAttribute('CONTENT')}`
			else return `${prev} `
		}, '')
}
