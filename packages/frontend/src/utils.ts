import { LayerType } from '@docere/common'
import type { Layer, TextLayer, XmlLayer, PageConfig } from '@docere/common'

export function isTextLayer(layer: Layer): layer is TextLayer {
	return layer.type === LayerType.Text
}

export function isXmlLayer(layer: Layer): layer is XmlLayer {
	return layer.type === LayerType.XML
}

export function analyzeWindowLocation() {
	const [, projectId, documentType, ...documentId] = window.location.pathname.split('/')

	return {
		projectId,
		documentType,
		documentId: documentId.join('/'),
	}
}

function getProjectDir(projectId: string) {
	return `/node_modules/@docere/projects/src/${projectId}`
} 

export function getEntryXmlPath(projectSlug: string, documentId: string) {
	return `${getProjectDir(projectSlug)}/xml/${documentId}.xml`
}

export function getPageXmlPath(projectSlug: string, page: PageConfig) {
	return `${getProjectDir(projectSlug)}/pages/${page.path}`
}

export async function fetchEntryXml(projectSlug: string, documentId: string) {
	let doc: XMLDocument

	try {
		doc = await fetchXml(getEntryXmlPath(projectSlug, documentId))
	} catch (err) {
		doc = null			
	}

	return doc
}

export function fetchXml(url: string): Promise<XMLDocument> {
	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest
		xhr.open('GET', url)
		xhr.responseType = 'document'
		xhr.overrideMimeType('text/xml')

		xhr.onload = function() {
			if (xhr.readyState === xhr.DONE && xhr.status === 200) {
				resolve(xhr.responseXML)
			} else {
				reject()
			}
		}

		xhr.send()
	})
}

export async function fetchJson(url: string) {
	const result = await fetch(url)
	return await result.json()
}

export async function fetchPost(url: string, body: any) {
	const response = await fetch(url, {
		body: JSON.stringify(body),
		headers: { 'Content-Type': 'application/json' },
		method: "POST",
	})

	if (response.headers.get("content-length") !== '0')	{
		const data = await response.json()
		return data
	}
}

// Used for debugging and performance improvements
export function compareProps(prevProps: any, nextProps: any) {
	Object.keys(prevProps).forEach(key =>
		console.log(`${key}\t\t${prevProps[key] === nextProps[key]}`)
	)
	console.log('=-=-=-=-=-=-=-=')
	return false
}
