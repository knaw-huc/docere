import React from 'react'
import { useNavigate, useComponents, DocereComponentContainer, usePage } from '@docere/common'
import DocereTextView from '@docere/text'

import { PopupBodyLink, PopupBodyWrapper } from './body'

import type { DocereComponentProps, NavigatePayload, ActiveEntity } from '@docere/common'


interface PageLinkProps {
	activeEntity: ActiveEntity
	children: React.ReactNode
	// useNavigate: DocereComponentProps['useNavigate']
}
function PageLink(props: PageLinkProps) {
	const navigate = useNavigate()

	const goToPage = React.useCallback((ev: React.MouseEvent) => {
		ev.stopPropagation()

		const payload: NavigatePayload = { type: 'page', id: props.activeEntity.type }
		if (props.activeEntity.id != null) payload.query = { entity: { id: props.activeEntity.id, type: null } }

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

export function PagePopupBody(props: DocereComponentProps) {
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
				// useNavigate={props.useNavigate}
			>
				Go to {page.title}
			</PageLink>
		</PopupBodyWrapper>
	)
}
