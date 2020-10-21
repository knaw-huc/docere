import React from 'react'
import { useUIComponent, UIComponentType, Hit, Entity, UrlObject, useNavigate } from '@docere/common'
import { PopupBodyWrapper, PopupBodyLink } from './index'
import { PopupBodyProps } from '..'

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
	const navigate = useNavigate()

	const goToEntry = React.useCallback((ev: React.MouseEvent) => {
		ev.stopPropagation()

		const payload: UrlObject = { entryId: props.entity.id }

		// TODO use entryDispatch (see ./page-part.tsx)
		navigate(payload)
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

export default function EntryLinkPopupBody(props: PopupBodyProps) {
	const result = useSearchResult(props.entity.id)
	const ResultBodyComponent = useUIComponent(UIComponentType.SearchResult)

	if (ResultBodyComponent == null || result == null) return null

	return (
		<PopupBodyWrapper>
			<ResultBodyComponent {...props} result={result} />
			<EntryLink
				entity={props.entity}
			>
				Go to entry
			</EntryLink>
		</PopupBodyWrapper>
	)
}
