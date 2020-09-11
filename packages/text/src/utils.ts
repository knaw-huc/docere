function fetchXml(url: string): Promise<any> {
	const rejectMessage = `Fetching XML of "${url}" failed`

	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest
		xhr.open('GET', url)
		xhr.responseType = 'document'
		xhr.overrideMimeType('text/xml')

		xhr.onload = function() {
			if (xhr.readyState === xhr.DONE && xhr.status === 200 && xhr.responseXML != null) {
				resolve(xhr.responseXML)
			} else {
				reject(rejectMessage)
			}
		}

		xhr.send()
	})
}

function attrsToObject(attrs: any) {
	const tmpAttrs = {} as any
	for (const attr of attrs) {
		tmpAttrs[attr.name] = attr.value
	}
	return tmpAttrs
}

export {
	attrsToObject,
	fetchXml,
}
