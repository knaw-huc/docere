import { analyzeWindowLocation } from '../../utils'
import { Viewport } from '@docere/common'
import type { AppStateAction } from '@docere/common'

export default class HistoryNavigator {
	/* 
	 * if this.pop is true, the next call to this.push is coming from a popstate event,
	 * which means the state should be replaced instead of pushed
	 */
	private pop: boolean = false

	constructor(appDispatch: React.Dispatch<AppStateAction>) {
		window.addEventListener('popstate', _ev => {
			this.pop = true

			const { documentId, documentType } = analyzeWindowLocation()

			if (documentType == null) appDispatch({ type: 'SET_VIEWPORT', viewport: Viewport.EntrySelector })
			else if (documentType == 'entries') appDispatch({ type: 'SET_ENTRY_ID', id: documentId })
			else if (documentType == 'pages') appDispatch({ type: 'SET_PAGE_ID', id: documentId })
		})
	}

	push(url: string, title: string, state: Record<string, string> = {}) {
		if (this.pop) history.replaceState(state, title, url)
		else history.pushState(state, title, url)
		document.title = title
		this.pop = false
	}
}
