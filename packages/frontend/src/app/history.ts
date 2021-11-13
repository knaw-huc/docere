import React from "react"
import { useHistory } from "react-router-dom"

function isPage(pathname: string) {
	return /^\/projects\/\w*?\/pages/.test(pathname)	
}

class DocereHistory {
	paths: string[] = []

	/**
	 * Push next pathname to the stack
	 * 
	 * @param pathname 
	 */
	push(pathname: string) {
		// Remove older versions of the same path, to not have duplicates
		this.paths = this.paths.filter(p => p !== pathname)

		// Add last visited pathname to the front of this.paths
		this.paths.unshift(pathname)

		// Never exceed 100 items
		this.paths.slice(0, 100)
	}

	/**
	 * Get the last visited path which is not a page
	 * 
	 * This is used to find the referrer of a page. When the 
	 * user closes the page, the user is returned to the last
	 * non page (search or entry)
	 */
	getLastNonPage() {
		return this.paths.find(p => !isPage(p))
	}
}
export const docereHistory = new DocereHistory()

export const HistoryContext = React.createContext<DocereHistory>(docereHistory)

export function DocereHistoryController(props: any) {
	const history = useHistory()

	React.useEffect(() => {
		// Add the first page to docereHistory
		docereHistory.push(location.pathname)

		// Add subsequent pages to docereHistory
		const unlisten = history.listen(location => {
			docereHistory.push(location.pathname)
		})

		// Clean up
		return unlisten
	}, [])

	return props.children
}
