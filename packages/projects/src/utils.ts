// import { ExtractEntryPartElements, ExtractTextLayerElement } from '@docere/common'

import { PartialStandoffAnnotation } from "@docere/common"

// export function extractLayerElement(selector: string): ExtractTextLayerElement {
// 	return entry => entry.preparedElement.querySelector(selector)
// }

// function getChapterId(el: Element, attribute: string, index: number) {
// 	return attribute == null ?
// 		`part${index + 1}` :
// 		el.getAttribute(attribute)

// }

// export function extractEntryPartElements(selector: string, attribute?: string): ExtractEntryPartElements {
// 	return entry => {
// 		const chapters: Map<string, Element> = new Map()
// 		let i = 0

// 		for (const el of entry.document.querySelectorAll(selector)) {
// 			const chapterId = getChapterId(el, attribute, i)
// 			chapters.set(chapterId, el)
// 		}
// 		return chapters
// 	}

// }

// export function extractEntryPartElementsFromMilestone(selector: string, attribute?: string): ExtractEntryPartElements {
// 	return entry => {
// 		const chapters: Map<string, Element> = new Map()

// 		const milestones = entry.document.querySelectorAll(selector)
// 		Array.from(milestones)
// 			.forEach((milestone, index) => {
// 				const chapterId = getChapterId(milestone, attribute, index)

// 				const range = new Range()
// 				range.setStartAfter(milestone)	
// 				if (milestones[index + 1] != null) {
// 					range.setEndBefore(milestones[index + 1])
// 				}
// 				const el = document.createElement('div')
// 				el.appendChild(range.extractContents())
// 				chapters.set(chapterId, el)
// 			})

// 		return chapters
// 	}
// }

export function hasMetadataValue(annotation: PartialStandoffAnnotation, metadataKey: string) {
	return (
		annotation.sourceProps.hasOwnProperty(metadataKey) &&
		annotation.sourceProps[metadataKey] != null
	)
}

export const NoOp = () => null as JSX.Element

export const useAll = () => () => true
