import React from 'react'
import { EsDataType, SortBy, SortDirection } from '@docere/common'

import Context, { defaultFacetedSearchProps } from './context'
import App from './app'
import extendFacetConfig from './extend-facet-config'

import type { FacetedSearchContext, FacetedSearchProps, ResultBodyProps } from '@docere/common'

export { EsDataType, SortBy, SortDirection }

export type {
	FacetedSearchProps,
	ResultBodyProps
}

export default function FacetedSearch(props: FacetedSearchProps) {
	const [facetsConfig, setFacetsConfig] = React.useState<FacetedSearchContext['facetsConfig']>(extendFacetConfig(props.facetsConfig))

	React.useEffect(() => {
		setFacetsConfig(extendFacetConfig(props.facetsConfig))	
	}, [props.facetsConfig])

	return (
		<Context.Provider value={{ ...defaultFacetedSearchProps, ...props, facetsConfig }}>
			<App />
		</Context.Provider>
	)
}
