import React from 'react'
import styled from 'styled-components'
import { getNote, getPb, Lb, Hi, Paragraph, Entity } from '@docere/text-components'
import { useComponents, DocereComponentContainer, Colors, usePage, NavigatePayload } from '@docere/common'
import DocereTextView from '@docere/text'

import type { DocereComponentProps, DocereConfig } from '@docere/common'

const Link = styled.button`
	background: none;
	border: none;
	color: inherit;
	cursor: pointer;
	font-size: inherit;
	font-weight: normal;
	height: 100%;
	outline: none;
	margin: 0 1em;
	text-transform: inherit;

	&:hover {
		color: #EEE;
	}
`

interface PageLinkProps {
	children: React.ReactNode
	navigate: DocereComponentProps['navigate']
	pageId: string
	partId: string
}
function PageLink(props: PageLinkProps) {
	const goToPage = React.useCallback(() => {
		const payload: NavigatePayload = { type: 'page', id: props.pageId }
		if (props.partId != null) payload.query = { activeId: props.partId }
		props.navigate(payload)
	}, [props.pageId, props.partId])

	return (
		<Link
			onClick={goToPage}
		>
			{props.children}
		</Link>
	)
}

function pagePart(pageId: string, partId: string, el: Element) {
	return function PagePart(props: DocereComponentProps) {
		const components = useComponents(DocereComponentContainer.Page, pageId)

		return (
			<>
				<DocereTextView
					components={components}
					node={el}
				/>
				<PageLink
					navigate={props.navigate}
					pageId={pageId}
					partId={partId}
				>
					more
				</PageLink>
			</>
		)
	}
}

function MondrianLb(props: DocereComponentProps) {
	return (
		<>
			<Lb {...props} />
			{
				props.entrySettings['panels.text.showLineBeginnings'] &&
				props.attributes.rend?.indexOf('indent') > -1 &&
				<span>&nbsp;&nbsp;</span>
			}
		</>
	)
}

export default async function entryComponents(config: DocereConfig) {
	return {
		// Show <add> in green in the diplomatic version and in default color in the read version
		add: styled.span`
			color: ${(props: DocereComponentProps) => props.entrySettings['panels.text.showLineBeginnings'] ? Colors.Green : 'initial'};
		`,
		// Show <del> in red in the diplomatic version and hide in the read version
		del: styled.span`
			color: ${Colors.Red};
			display: ${(props: DocereComponentProps) => props.entrySettings['panels.text.showLineBeginnings'] ? 'inline' : 'none'};
		`,
		lb: MondrianLb,
		pb: getPb(props => props.attributes.facs?.slice(1)),
		ptr: getNote(props => props.attributes.target.slice(1)),
		hi: Hi,
		p: Paragraph,
		'ref[target^="bio.xml#"]': (props: DocereComponentProps) => {
			const page = usePage('bio')

			const bioId = /^bio\.xml#(.*)$/.exec(props.attributes.target)[1]

			if (page == null) return null
			return (
				<Entity
					customProps={props}
					entitiesConfig={config.entities}
					id={bioId}
					configId={'person'}
					PopupBody={pagePart('bio', bioId, page.parts.get(bioId))}
					// revealOnHover={isEntity || hasSuggestion ? false : true}
				>
					{props.children}
				</Entity>
			)
		},
		'ref[target^="biblio.xml#"]': (props: DocereComponentProps) => {
			const page = usePage('biblio')

			const biblioId = /^biblio\.xml#(.*)$/.exec(props.attributes.target)[1]

			if (page == null) return null
			return (
				<Entity
					customProps={props}
					entitiesConfig={config.entities}
					id={biblioId}
					configId={'bibl'}
					PopupBody={pagePart('biblio', biblioId, page.parts.get(biblioId))}
				>
					{props.children}
				</Entity>
			)
		}
	}

}
