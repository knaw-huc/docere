import { Colors } from './enum';

export const DEFAULT_POPUP_BG_COLOR = Colors.Blue
export const SPOT_COLOR = Colors.BlueBright

export const DEFAULT_SPACING = 32

export const RESULT_ASIDE_WIDTH = DEFAULT_SPACING * 5
export const ASIDE_WIDTH = DEFAULT_SPACING * 15
export const ASIDE_HANDLE_HEIGHT = DEFAULT_SPACING * 1.5
export const ASIDE_HANDLE_WIDTH = DEFAULT_SPACING

export const FOOTER_HEIGHT = DEFAULT_SPACING * 5
export const FOOTER_HANDLE_HEIGHT = ASIDE_HANDLE_WIDTH

export const PANEL_HEADER_HEIGHT = DEFAULT_SPACING * 7/8 // 28px

// export const TOPMENU_HEIGHT = DEFAULT_SPACING
export const MAINHEADER_HEIGHT = DEFAULT_SPACING
export const TOP_OFFSET = MAINHEADER_HEIGHT // + TOPMENU_HEIGHT


/*	gutter				text          spacing     aside   spacing
+-----------|--------------------------+----+-------------+----+
|           |                          |    | active ?    |    |
|    96     |           480            | 32 |   240 :     | 64 |
|           |                          |    |   48        |    |
+-----------|--------------------------+----+-------------+----+*/
export const TEXT_PANEL_GUTTER_WIDTH = DEFAULT_SPACING * 4 /* 96 */
export const TEXT_PANEL_TEXT_WIDTH = DEFAULT_SPACING * 15 /* 480 */
export const TEXT_PANEL_MINIMAP_WIDTH = DEFAULT_SPACING * 1.5 /* 48px */
export const TEXT_PANEL_ASIDE_WIDTH = DEFAULT_SPACING * 7.5 /* 240px */
// export const TEXT_PANEL_WIDTH = DEFAULT_SPACING + TEXT_PANEL_TEXT_WIDTH + (2 * DEFAULT_SPACING)

// export const TEXT_PANEL_WIDTH_MINIMAP_ACTIVE = TEXT_PANEL_WIDTH + TEXT_PANEL_MINIMAP_WIDTH
// export const TEXT_PANEL_WIDTH_ASIDE_ACTIVE = TEXT_PANEL_WIDTH - TEXT_PANEL_MINIMAP_WIDTH + TEXT_PANEL_ASIDE_WIDTH
