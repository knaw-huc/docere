function fetchXml(url: string): Promise<any> {
	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest
		xhr.open('GET', url)
		xhr.responseType = 'document'
		xhr.overrideMimeType('text/xml')

		xhr.onload = function() {
			if (xhr.readyState === xhr.DONE && xhr.status === 200) {
				if (xhr.responseXML == null) {
					reject(`Fetching XML of "${url}" failed`)
					return
				}
				resolve(xhr.responseXML)
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
