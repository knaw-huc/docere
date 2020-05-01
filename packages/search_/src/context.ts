import React from "react"
import { Colors } from '@docere/common'

import type { FacetedSearchProps } from '@docere/common'

export const defaultFacetedSearchProps: FacetedSearchProps = {
	ResultBodyComponent: () => null,
	excludeResultFields: [],
	// facetsConfig: {},
	onClickResult: () => {},
	resultFields: [],
	resultsPerPage: 10,
	style: {
		spotColor: Colors.BlueBright
	},
	url: null
}

export default React.createContext<FacetedSearchProps>(null)
