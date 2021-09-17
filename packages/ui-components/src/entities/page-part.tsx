import React from 'react'
import { useComponents, ContainerType, usePage, DispatchContext } from '@docere/common'
import { DocereTextView } from '@docere/text'

import { LinkFooter, EntityWithLinkWrapper } from './link-wrapper'

import { EntityComponentProps, EntityWrapper } from './wrapper'


function PageLink(props: EntityComponentProps) {
	const dispatch = React.useContext(DispatchContext)

	const goToPage = React.useCallback((ev: React.MouseEvent) => {
		ev.stopPropagation()

		dispatch({
			type: 'SET_PAGE_ID',
			setPage: {
				entityIds: new Set([props.entity.props.entityId]),
				pageId: props.entity.props.entityConfig.id,
			}
		})
	}, [props.entity])

	return (
		<LinkFooter
			entity={props.entity}
			onClick={goToPage}
		>
			{props.children}
		</LinkFooter>
	)
}

/**
 * Represents an entity in a text layer which is part of a {@link Page}.
 * 
 * A {@link Page} can be split in parts with the right configuration. This 
 * component shows a part of the page in a text layer. This can be used to
 * visualise (relatively simple and small sized) structured data.
 */
export const PagePartEntity = React.memo(function(props: EntityComponentProps) {
	const page = usePage(props.entity.props.entityConfig.id)
	const components = useComponents(ContainerType.Page, page?.id)

	if (page == null) return null

	// TODO add tree
	return (
		<EntityWrapper
			entity={props.entity}
		>
			<EntityWithLinkWrapper>
				<DocereTextView
					components={components}
					standoffTree={null}
				/>
				<PageLink
					entity={props.entity}
				>
					Go to {page.title}
				</PageLink>
			</EntityWithLinkWrapper>
		</EntityWrapper>
	)
})
