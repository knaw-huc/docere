/// <reference path="./app.state.action.d.ts" />
/// <reference path="./components.d.ts" />
/// <reference path="./config.d.ts" />
/// <reference path="./entry.d.ts" />
/// <reference path="./entry.state.action.d.ts" />
/// <reference path="./panels.d.ts" />
/// <reference path="./search/index.d.ts" />

type Page = PageConfig & { doc: XMLDocument }

interface AppState {
	entry: Entry
	entryId: string
	page: Page
	pageId: string
	searchQuery: string[]
	searchTab: import('../enum').SearchTab
	viewport: import('../enum').Viewport
}

type FileExplorerProps = Pick<AppState, 'entry' | 'searchTab' | 'viewport'> & {
	appDispatch: React.Dispatch<AppStateAction>
}
