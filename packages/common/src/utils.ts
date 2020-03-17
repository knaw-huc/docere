import { DEFAULT_SPACING, TEXT_PANEL_ASIDE_WIDTH, TEXT_PANEL_MINIMAP_WIDTH, TEXT_PANEL_TEXT_WIDTH } from './constants'

export function getTextPanelLeftSpacing(settings: EntrySettings) {
	let width = DEFAULT_SPACING

	if (settings['panels.text.showLineBeginnings']) width += 2 * DEFAULT_SPACING
	if (settings['panels.text.showPageBeginnings']) width += 2 * DEFAULT_SPACING

	if (settings['panels.text.showLineBeginnings'] && settings['panels.text.showPageBeginnings']) width -= DEFAULT_SPACING

	return width
}

export function getTextPanelRightSpacing(settings: EntrySettings, activeNote: Note, activeEntity: Entity) {
	let width = 2 * DEFAULT_SPACING

	const asideActive = (
		!settings['panels.text.openPopupAsTooltip'] &&
		(activeNote != null || activeEntity != null)
	)

	if (asideActive) width += TEXT_PANEL_ASIDE_WIDTH
	if (settings['panels.text.showMinimap']) width += TEXT_PANEL_MINIMAP_WIDTH + DEFAULT_SPACING
	if (asideActive && settings['panels.text.showMinimap']) width -= DEFAULT_SPACING

	return width
}

export function getTextPanelWidth(settings: EntrySettings, activeNote: Note, activeEntity: Entity) {
	const left = getTextPanelLeftSpacing(settings)
	const right = getTextPanelRightSpacing(settings, activeNote, activeEntity)

	return left + TEXT_PANEL_TEXT_WIDTH + right
}
