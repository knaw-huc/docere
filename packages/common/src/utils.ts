import { DEFAULT_SPACING, TEXT_PANEL_ASIDE_WIDTH, TEXT_PANEL_MINIMAP_WIDTH, TEXT_PANEL_TEXT_WIDTH } from './constants'
import type { DocereConfig } from './types/config-data/config'
import type { Note, Entity } from './types/config-data/functions'

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
