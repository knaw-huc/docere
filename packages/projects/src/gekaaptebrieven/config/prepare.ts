import { ExtractedEntry } from '@docere/common'

export default function prepareDocument(entry: ExtractedEntry) {
	entry.document.querySelectorAll('ne-start').forEach(el => el.parentElement.removeChild(el))
	entry.document.querySelectorAll('ne-end').forEach(el => el.parentElement.removeChild(el))
	return entry.document.documentElement
}
