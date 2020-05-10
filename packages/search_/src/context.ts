import React from "react"
import { Colors } from '@docere/common'

import type { FacetedSearchProps } from '@docere/common'

export const defaultFacetedSearchProps: FacetedSearchProps = {
	ResultBodyComponent: () => null,
	excludeResultFields: [],
	onClickResult: () => {},
	resultFields: [],
	resultsPerPage: 10,
	small: false, /* Render for small screen (~< 1000px) */
	style: {
		spotColor: Colors.BlueBright
	},
	url: null
}

export default React.createContext<FacetedSearchProps>(null)
