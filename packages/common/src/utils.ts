import { DEFAULT_SPACING, TEXT_PANEL_ASIDE_WIDTH, TEXT_PANEL_MINIMAP_WIDTH, TEXT_PANEL_TEXT_WIDTH } from './constants'
import { LayerType } from './enum'

import type { DocereConfig, Note, Entity, LayerConfig, PageConfig, TextLayerConfig, FacsimileLayerConfig, TextLayer, Layer, FacsimileLayer, SerializedLayer, SerializedTextLayer, SerializedFacsimileLayer } from './types'

export function getTextPanelLeftSpacing(settings: DocereConfig['entrySettings']) {
	let width = DEFAULT_SPACING

	if (settings['panels.text.showLineBeginnings']) width += 2 * DEFAULT_SPACING
	if (settings['panels.text.showPageBeginnings']) width += 2 * DEFAULT_SPACING

	if (settings['panels.text.showLineBeginnings'] && settings['panels.text.showPageBeginnings']) width -= DEFAULT_SPACING

	return width
}

export function getTextPanelRightSpacing(settings: DocereConfig['entrySettings'], activeNote: Note, activeEntity: Entity) {
	let width = DEFAULT_SPACING

	const asideActive = (
		!settings['panels.text.openPopupAsTooltip'] &&
		(activeNote != null || activeEntity != null)
	)

	// Add extra width if the aside is active
	if (asideActive) width += TEXT_PANEL_ASIDE_WIDTH + DEFAULT_SPACING
	// if the aside is not active, but the minimap is, we need to add some space for the minimap.
	// if the aside is active, there is already enought space for the minimap
	else if (settings['panels.text.showMinimap']) width += TEXT_PANEL_MINIMAP_WIDTH + DEFAULT_SPACING

	return width
}

export function getTextPanelWidth(settings: DocereConfig['entrySettings'], activeNote: Note, activeEntity: Entity) {
	const left = getTextPanelLeftSpacing(settings)
	const right = getTextPanelRightSpacing(settings, activeNote, activeEntity)

	return left + TEXT_PANEL_TEXT_WIDTH + right
}

function byteToHex(byte: number) {
	const hex = ('0' + byte.toString(16)).slice(-2);
	return hex
}

export function generateId(len = 10) {
	var arr = new Uint8Array((len || 40) / 2);
	window.crypto.getRandomValues(arr);
	const tail = [].map.call(arr, byteToHex).join("");
	const head = String.fromCharCode(97 + Math.floor(Math.random() * 26))
	return `${head}${tail}`
}

export function isTextLayerConfig(layer: LayerConfig): layer is TextLayerConfig {
	return layer.type === LayerType.Text
}

export function isTextLayer(layer: Layer): layer is TextLayer {
	return layer.type === LayerType.Text
}

export function isSerializedTextLayer(layer: SerializedLayer): layer is SerializedTextLayer {
	return layer.type === LayerType.Text
}

export function isFacsimileLayerConfig(layer: LayerConfig): layer is FacsimileLayerConfig {
	return layer.type === LayerType.Facsimile
}

export function isSerializedFacsimileLayer(layer: SerializedLayer): layer is SerializedFacsimileLayer {
	return layer.type === LayerType.Facsimile
}

export function isFacsimileLayer(layer: Layer): layer is FacsimileLayer {
	return layer.type === LayerType.Facsimile
}

// TODO Move window analyzer to app state reducer?
export function analyzeWindowLocation() {
	const [, projectId, documentType, ...documentId] = window.location.pathname.split('/')

	return {
		projectId,
		documentType,
		documentId: documentId.join('/'),
	}
}

export function isSearchPage() {
	return analyzeWindowLocation().documentType === 'search'
}

// function getProjectDir(projectId: string) {
// 	return `/node_modules/@docere/projects/src/${projectId}`
// } 

// export function getPageXmlPath(projectSlug: string, page: PageConfig) {
// 	return `${getProjectDir(projectSlug)}/pages/${page.path}`
// }
export async function fetchPageConfig(projectId: string, pageId: string): Promise<PageConfig> {
	const endpoint = `/api/projects/${projectId}/pages/${pageId}/config`
	return await fetchJson(endpoint)
}

export async function fetchPageXml(projectSlug: string, pageId: string) {
	const endpoint = `/api/projects/${projectSlug}/pages/${pageId}`

	let doc: XMLDocument
	try {
		doc = await fetchXml(endpoint)
	} catch (err) {
		doc = null			
	}

	return doc
}

export async function fetchEntryXml(projectSlug: string, documentId: string) {
	const endpoint = `/api/projects/${projectSlug}/documents/${documentId}/original`

	let doc: XMLDocument
	try {
		doc = await fetchXml(endpoint)
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
	const response = await fetch(url)
	if (!response.ok) return null
	return await response.json()
}

export async function fetchPost(url: string, body: any) {
	if (typeof body !== 'string') body = JSON.stringify(body)

	const response = await fetch(url, {
		body,
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
