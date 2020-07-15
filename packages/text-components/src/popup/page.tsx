import React from 'react'
import styled from 'styled-components'
import { useComponents, DocereComponentContainer, usePage, DEFAULT_SPACING } from '@docere/common'
import DocereTextView from '@docere/text'

import type { DocereComponentProps, NavigatePayload, ActiveEntity, EntityConfig } from '@docere/common'


interface LinkProps {
	entityConfig: EntityConfig
}
export const Link = styled.button`
	background: ${(props: LinkProps) => props.entityConfig.color}11;
	border: none;
	border-top: 1px solid gray;
	color: gray;
	cursor: pointer;
	font-size: inherit;
	font-weight: normal;
	height: 100%
	margin: 0;
	outline: none;
	padding: 0;
	text-transform: inherit;

	&:hover {
		color: black;
	}
`

interface PageLinkProps {
	activeEntity: ActiveEntity
	children: React.ReactNode
	navigate: any
}
function PageLink(props: PageLinkProps) {
	const goToPage = React.useCallback((ev: React.MouseEvent) => {
		ev.stopPropagation()

		const payload: NavigatePayload = { type: 'page', id: props.activeEntity.type }
		if (props.activeEntity.id != null) payload.query = { activeId: props.activeEntity.id }

		props.navigate(payload)
	}, [props.activeEntity])

	return (
		<Link
			entityConfig={props.activeEntity.config}
			onClick={goToPage}
		>
			{props.children}
		</Link>
	)
}

export const Wrapper = styled.div`
	display: grid;
	grid-template-rows: auto ${DEFAULT_SPACING}px;

	& > div:first-of-type {
		padding: 1rem;
	}
`

export function PagePopupBody(props: DocereComponentProps) {
	const page = usePage(props.activeEntity.type)
	const components = useComponents(DocereComponentContainer.Page, page?.id)
	const navigate = props.useNavigate()

	if (page == null) return null

	return (
		<Wrapper>
			<DocereTextView
				components={components}
				node={page.parts.get(props.activeEntity.id)}
			/>
			<PageLink
				activeEntity={props.activeEntity}
				navigate={navigate}
			>
				Go to {page.title}
			</PageLink>
		</Wrapper>
	)
}
