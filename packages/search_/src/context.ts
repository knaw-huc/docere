import React from "react"
import { Colors, Language } from '@docere/common'
import { LanguageMap } from './language/nl'

import type { FacetedSearchProps } from '@docere/common'

export const defaultFacetedSearchProps: FacetedSearchProps = {
	ResultBodyComponent: () => null,
	excludeResultFields: [],
	language: Language.EN,
	onClickResult: () => {},
	resultFields: [],
	resultsPerPage: 10,
	small: false, /* Render for small screen (~< 1000px) */
	style: {
		spotColor: Colors.BlueBright
	},
	url: null
}

type FacetedSearchContext = Omit<FacetedSearchProps, 'language'> & { i18n: LanguageMap }

const FacetedSearchContext =  React.createContext<FacetedSearchContext>(null)
export default FacetedSearchContext
