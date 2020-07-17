import React from 'react'
import { useNavigate, useComponents, DocereComponentContainer, usePage } from '@docere/common'
import DocereTextView from '@docere/text'

import { PopupBodyLink, PopupBodyWrapper } from './index'

import type { DocereComponentProps, NavigatePayload, ActiveEntity } from '@docere/common'


interface PageLinkProps {
	activeEntity: ActiveEntity
	children: React.ReactNode
}
function PageLink(props: PageLinkProps) {
	const navigate = useNavigate()

	const goToPage = React.useCallback((ev: React.MouseEvent) => {
		ev.stopPropagation()

		const payload: NavigatePayload = { type: 'page', id: props.activeEntity.type }
		if (props.activeEntity.id != null) payload.query = { entityId: props.activeEntity.id }

		navigate(payload)
	}, [props.activeEntity])

	return (
		<PopupBodyLink
			entityConfig={props.activeEntity.config}
			onClick={goToPage}
		>
			{props.children}
		</PopupBodyLink>
	)
}

export default function PagePartPopupBody(props: DocereComponentProps) {
	if (props.activeEntity == null) return null

	const page = usePage(props.activeEntity.type)
	const components = useComponents(DocereComponentContainer.Page, page?.id)

	if (page == null) return null

	return (
		<PopupBodyWrapper>
			<DocereTextView
				components={components}
				node={page.parts.get(props.activeEntity.id)}
			/>
			<PageLink
				activeEntity={props.activeEntity}
			>
				Go to {page.title}
			</PageLink>
		</PopupBodyWrapper>
	)
}
