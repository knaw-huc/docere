import React from 'react'
import { DocereComponentProps, useUIComponent, UIComponentType, Hit, ActiveEntity, NavigatePayload } from '@docere/common'
import { Wrapper, Link } from './page'

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
	activeEntity: ActiveEntity
	children: React.ReactNode
	navigate: DocereComponentProps['navigate']
}
function EntryLink(props: EntryLinkProps) {
	const goToEntry = React.useCallback((ev: React.MouseEvent) => {
		ev.stopPropagation()

		const payload: NavigatePayload = { type: 'entry', id: props.activeEntity.id }
		// if (props.activeEntity.id != null) payload.query = { activeId: props.activeEntity.id }

		props.navigate(payload)
	}, [props.activeEntity])

	console.log(props.activeEntity)

	return (
		<Link
			entityConfig={props.activeEntity.config}
			onClick={goToEntry}
		>
			{props.children}
		</Link>
	)
}

export function EntryPopupBody(props: DocereComponentProps) {
	const result = useSearchResult(props.activeEntity?.id)
	const ResultBodyComponent = useUIComponent(UIComponentType.SearchResult)
	if (ResultBodyComponent == null || result == null) return null

	return (
		<Wrapper>
			<ResultBodyComponent {...props} result={result} />
			<EntryLink
				activeEntity={props.activeEntity}
				navigate={props.navigate}
			>
				Go to entry
			</EntryLink>
		</Wrapper>
	)
}
