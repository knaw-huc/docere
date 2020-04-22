import React from "react"
import { Colors } from '@docere/common'

import type { FacetedSearchContext } from '@docere/common'

export const defaultFacetedSearchProps: FacetedSearchContext = {
	activeFilters: {},
	ResultBodyComponent: () => null,
	excludeResultFields: [],
	facetsConfig: {},
	onClickResult: () => {},
	resultFields: [],
	resultsPerPage: 10,
	style: {
		spotColor: Colors.BlueBright
	},
	url: null
}

export default React.createContext<FacetedSearchContext>(null)
