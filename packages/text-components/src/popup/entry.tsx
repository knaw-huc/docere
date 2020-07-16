import React from 'react'
import { DocereComponentProps, useUIComponent, UIComponentType, Hit, ActiveEntity, NavigatePayload, useNavigate } from '@docere/common'
import { PopupBodyWrapper, PopupBodyLink } from './body'

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
}
function EntryLink(props: EntryLinkProps) {
	const navigate = useNavigate()

	const goToEntry = React.useCallback((ev: React.MouseEvent) => {
		ev.stopPropagation()

		const payload: NavigatePayload = { type: 'entry', id: props.activeEntity.id }

		navigate(payload)
	}, [props.activeEntity])

	return (
		<PopupBodyLink
			entityConfig={props.activeEntity.config}
			onClick={goToEntry}
		>
			{props.children}
		</PopupBodyLink>
	)
}

export function EntryPopupBody(props: DocereComponentProps) {
	if (props.activeEntity == null) return null
	const result = useSearchResult(props.activeEntity?.id)
	const ResultBodyComponent = useUIComponent(UIComponentType.SearchResult)

	if (ResultBodyComponent == null || result == null) return null

	return (
		<PopupBodyWrapper>
			<ResultBodyComponent {...props} result={result} />
			<EntryLink
				activeEntity={props.activeEntity}
			>
				Go to entry
			</EntryLink>
		</PopupBodyWrapper>
	)
}
