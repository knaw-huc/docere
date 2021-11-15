import { DEFAULT_SPACING, TEXT_PANEL_ASIDE_WIDTH, TEXT_PANEL_MINIMAP_WIDTH, TEXT_PANEL_TEXT_WIDTH } from './constants'
import { LayerType } from './enum'
import { ActiveEntities } from './project/context'

import type { EntrySettings, LayerConfig, TextLayerConfig, Layer, TextLayer, FacsimileLayerConfig, FacsimileLayer, ID, PartialStandoff } from '.'
import { getProjectPagePath } from './url'

export function getTextPanelLeftSpacing(settings: EntrySettings) {
	let width = DEFAULT_SPACING

	if (settings['panels.text.showLineBeginnings']) width += 2 * DEFAULT_SPACING
	if (settings['panels.text.showPageBeginnings']) width += 2 * DEFAULT_SPACING

	if (settings['panels.text.showLineBeginnings'] && settings['panels.text.showPageBeginnings']) width -= DEFAULT_SPACING

	return width
}

export function getTextPanelRightSpacing(
	settings: EntrySettings, 
	activeEntities: ActiveEntities
) {
	let width = DEFAULT_SPACING

	const asideActive = (
		!settings['panels.text.openPopupAsTooltip'] &&
		activeEntities.size > 0
	)

	// Add extra width if the aside is active
	if (asideActive) width += TEXT_PANEL_ASIDE_WIDTH + DEFAULT_SPACING
	// if the aside is not active, but the minimap is, we need to add some space for the minimap.
	// if the aside is active, there is already enought space for the minimap
	else if (settings['panels.text.showMinimap']) width += TEXT_PANEL_MINIMAP_WIDTH + DEFAULT_SPACING

	return width
}

// TODO move getTPWidth to hook useTPWIdth?
export function getTextPanelWidth(
	settings: EntrySettings,
	activeEntities: ActiveEntities
) {
	const left = getTextPanelLeftSpacing(settings)
	const right = getTextPanelRightSpacing(settings, activeEntities)

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

// export function isExtractedEntity(entity: ExtractedEntity | ExtractedFacsimile): entity is ExtractedEntity {
// 	return entity.hasOwnProperty('type')
// }

export function isTextLayerConfig(layer: LayerConfig): layer is TextLayerConfig {
	return layer.type === LayerType.Text
}

export function isTextLayer(layer: Layer): layer is TextLayer {
	return layer.type === LayerType.Text
}

// export function isSerializedTextLayer(layer: SerializedLayer): layer is SerializedTextLayer {
// 	return layer.type === LayerType.Text
// }

export function isFacsimileLayerConfig(layer: LayerConfig): layer is FacsimileLayerConfig {
	return layer.type === LayerType.Facsimile
}

// export function isSerializedFacsimileLayer(layer: SerializedLayer): layer is SerializedFacsimileLayer {
// 	return layer.type === LayerType.Facsimile
// }

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

// export async function fetchPageConfig(projectId: string, pageId: string): Promise<PageConfig> {
// 	const endpoint = `/api/projects/${projectId}/pages/${pageId}/config`
// 	return await fetchJson(endpoint)
// }

export async function fetchPageXml(projectId: string, pageId: string): Promise<PartialStandoff> {
	const pagePath = getProjectPagePath(projectId, pageId)
	const response = await fetch(pagePath)
	return await response.json()
}

// export async function fetchEntryXml(projectSlug: string, documentId: string) {
// 	const endpoint = `/api/projects/${projectSlug}/documents/${documentId}/original`

// 	let doc: XMLDocument
// 	try {
// 		doc = await fetchXml(endpoint)
// 	} catch (err) {
// 		doc = null			
// 	}

// 	return doc
// }

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
				reject(xhr.statusText)
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

// Get the index of an item inside a
// Set<ID | number> or a key of a Map<ID | number, any>,
// just like Array.indexOf
export function indexOfIterator(collection: Map<ID | number, any>, item: string | number): number
export function indexOfIterator(collection: Set<ID | number>, item: string | number): number
export function indexOfIterator(collection: Set<ID | number> | Map<ID | number, any>, item: string | number): number {
	const iterator = collection.keys()

	let count = 0
	let next = iterator.next()
	while(next.value !== item && !next.done) {
		next = iterator.next()
		count++
	}

	return next.done ? null : count
}

export type XmlToString = (xml: XMLDocument | Element) => string
export function xmlToString(xml: XMLDocument | Element) {
	if (xml == null) return null
	const el = (xml instanceof XMLDocument) ? xml.documentElement : xml
	el.setAttribute('xmlns:docere', 'https://demo.docere.diginfra.net')
	return new XMLSerializer().serializeToString(xml)
}

export function getRectoVersoSequence(x: string) {
	if (x == null) return []
	const [start, end] = x.split('-')
	const [,startNoString, startVersorecto] = /(\d+)(r|v)/.exec(start)
	const startNo = parseInt(startNoString, 10)

	const regExpExecArray = /(\d+)(r|v)/.exec(end)
	if (end === 'v') {
		return [`${startNo}${startVersorecto}`, `${startNo}v`]
	} else if (end == null || regExpExecArray == null) {
		return [`${startNo}${startVersorecto}`]
	}

	const [,endNoString, endVersorecto] = regExpExecArray
	const endNo = parseInt(endNoString, 10)

	const rvString = `${startNo}${startVersorecto}-${endNo}${endVersorecto}`

	if (endNo < startNo) return []
	if (startNo === endNo && startVersorecto === 'v' && endVersorecto === 'r') return []

	let no = startNo
	let versorecto = startVersorecto
	const seq = []
	while (`${seq[0]}-${seq[seq.length - 1]}` !== rvString) {
		seq.push(`${no}${versorecto}`)
		if (versorecto === 'v') {
			no = no + 1
			versorecto = 'r'
		} else {
			versorecto = 'v'
		}
	}

	return seq
}

export class CombinedKeysCache<T> {
	private cache: Map<string, T> = new Map()

	has(key1: string, key2: string) {
		return this.cache.has(this.createKey(key1, key2))
	}

	get(key1: string, key2: string) {
		return this.cache.get(this.createKey(key1, key2))
	}

	set(key1: string, key2: string, value: T) {
		this.cache.set(this.createKey(key1, key2), value)
	}

	private createKey(key1: string, key2: string) {
		return `${key1}__${key2}`
	}
}

function endsWith(str: string, end: string) {
	if (str.length === 0) return false
	return str.slice(end.length * -1) === end
}

export function ensureEnd(str: string, end: string) {
	return endsWith(str, end) ? str : `${str}${end}`
}
