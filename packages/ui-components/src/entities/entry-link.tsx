import React from 'react'
import { useUIComponent, UIComponentType, Hit, DispatchContext } from '@docere/common'
import { EntityWithLinkWrapper, LinkFooter } from './link-wrapper'
import { EntityComponentProps, EntityWrapper } from './wrapper'

// TODO make generic
function useSearchResult(id: string) {
	const [result, setResult] = React.useState<Hit>(null)	
	React.useEffect(() => {
		if (id == null) return
		fetch(`/search/vangogh/_source/${id}?_source_excludes=text,text_suggest`)
			.then(response => response.json())
			.then(setResult)
	}, [id])
	return result
}

function EntryLink(props: EntityComponentProps) {
	const dispatch = React.useContext(DispatchContext)

	const goToEntry = React.useCallback((ev: React.MouseEvent) => {
		ev.stopPropagation()
		dispatch({
			type: 'SET_ENTRY_ID',
			setEntry: {
				entryId: props.entity.props._entityId
			}
		})
	}, [props.entity])

	return (
		<LinkFooter
			entity={props.entity}
			onClick={goToEntry}
		>
			{props.children}
		</LinkFooter>
	)
}

/**
 * Represents a link to an entry in a text layer.
 */
export const EntryLinkEntity = React.memo(function(props: EntityComponentProps) {
	const result = useSearchResult(props.entity.props._entityId)
	const ResultBodyComponent = useUIComponent(UIComponentType.SearchResult)

	if (ResultBodyComponent == null || result == null) return null

	return (
		<EntityWrapper
			entity={props.entity}
		>
			<EntityWithLinkWrapper>
				<ResultBodyComponent {...props} result={result} />
				<EntryLink
					entity={props.entity}
				>
					Go to entry
				</EntryLink>
			</EntityWithLinkWrapper>
		</EntityWrapper>
	)
})
