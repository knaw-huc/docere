import React from 'react'
import { useUIComponent, UIComponentType, Hit, Entity, DispatchContext } from '@docere/common'
import { PopupBodyWrapper, PopupBodyLink } from './index'
import { EntityComponentProps, EntityWrapper } from '..'

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

interface EntryLinkProps {
	entity: Entity
	children: React.ReactNode
}
function EntryLink(props: EntryLinkProps) {
	// const { setEntry } = React.useContext(EntryContext)
	const dispatch = React.useContext(DispatchContext)

	const goToEntry = React.useCallback((ev: React.MouseEvent) => {
		ev.stopPropagation()
		dispatch({
			type: 'SET_ENTRY_ID',
			setEntry: {
				entryId: props.entity.id
			}
		})
	}, [props.entity])

	return (
		<PopupBodyLink
			entity={props.entity}
			onClick={goToEntry}
		>
			{props.children}
		</PopupBodyLink>
	)
}

/**
 * Represents a link to an entry in a text layer.
 */
export const EntryLinkEntity = React.memo(function(props: EntityComponentProps) {
	const result = useSearchResult(props.entity.id)
	const ResultBodyComponent = useUIComponent(UIComponentType.SearchResult)

	if (ResultBodyComponent == null || result == null) return null

	return (
		<EntityWrapper entity={props.entity}>
			<PopupBodyWrapper>
				<ResultBodyComponent {...props} result={result} />
				<EntryLink
					entity={props.entity}
				>
					Go to entry
				</EntryLink>
			</PopupBodyWrapper>
		</EntityWrapper>
	)
})
