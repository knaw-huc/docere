import React from 'react'
import { useNavigate, useComponents, DocereComponentContainer, usePage } from '@docere/common'
import DocereTextView from '@docere/text'

import { PopupBodyLink, PopupBodyWrapper } from './index'

import type { UrlObject, Entity } from '@docere/common'
import type { PopupBodyProps } from '..'


interface PageLinkProps {
	entity: Entity
	children: React.ReactNode
}
function PageLink(props: PageLinkProps) {
	const navigate = useNavigate()

	const goToPage = React.useCallback((ev: React.MouseEvent) => {
		ev.stopPropagation()

		const urlObject: UrlObject = { pageId: props.entity.configId }
		if (props.entity.id != null) urlObject.query = { entityId: [props.entity.id] }

		// TODO Use dispatch? props.docereComponentProps.entryDispatch
		navigate(urlObject)
	}, [props.entity])

	return (
		<PopupBodyLink
			entity={props.entity}
			onClick={goToPage}
		>
			{props.children}
		</PopupBodyLink>
	)
}

export default function PagePartPopupBody(props: PopupBodyProps) {
	const page = usePage(props.entity.configId)
	const components = useComponents(DocereComponentContainer.Page, page?.id)

	if (page == null) return null

	return (
		<PopupBodyWrapper>
			<DocereTextView
				components={components}
				node={page.parts.get(props.entity.id)}
			/>
			<PageLink
				entity={props.entity}
			>
				Go to {page.title}
			</PageLink>
		</PopupBodyWrapper>
	)
}
