export interface EntrySettings {
	'panels.showHeaders'?: boolean

	'panels.text.openPopupAsTooltip'?: boolean
	'panels.text.showMinimap'?: boolean
	'panels.text.showLineBeginnings'?: boolean
	'panels.text.showPageBeginnings'?: boolean
	'panels.text.showNotes'?: boolean,

	/**
	 * Automatically remove current active entities when activating a new entity.
	 * When set to false, the previous active entities stay active and highlighted.
	 */ 
	'panels.entities.toggle'?: boolean,

	/** Show/hide entities */
	'panels.entities.show'?: boolean,
}


export const defaultEntrySettings: EntrySettings = {
	'panels.showHeaders': true,
	'panels.text.openPopupAsTooltip': true,
	'panels.text.showMinimap': true,
	'panels.text.showLineBeginnings': true,
	'panels.text.showPageBeginnings': true,
	'panels.entities.show': true,
	'panels.entities.toggle': true,
	'panels.text.showNotes': true,
}
