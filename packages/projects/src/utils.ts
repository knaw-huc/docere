import { ExtractEntryPartElements, ExtractTextLayerElement } from '@docere/common'

export function extractLayerElement(selector: string): ExtractTextLayerElement {
	return entry => entry.document.querySelector(selector)
}

export function extractEntryPartElements(selector: string, attribute: string): ExtractEntryPartElements {
	return entry => {
		const chapters: Map<string, Element> = new Map()
		for (const chapter of entry.document.querySelectorAll(selector)) {
			chapters.set(chapter.getAttribute(attribute), chapter)
		}
		return chapters
	}

}

export const NoOp = () => null as JSX.Element
