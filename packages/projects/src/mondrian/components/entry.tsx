import React from 'react'
import styled from 'styled-components'
import { getNote, getPb, Lb, Hi, Paragraph, Entity } from '@docere/text-components'
import { getPage, useComponents, DocereComponentContainer, Colors } from '@docere/common'
import DocereTextView from '@docere/text'

import type { DocereComponentProps, DocereConfig, Page } from '@docere/common'

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
	appDispatch: any
	partId: string
	pageId: string
}
function PageLink(props: PageLinkProps) {
	const setPage = React.useCallback(() => {
		props.appDispatch({ type: "SET_PAGE_ID", id: props.pageId })
	}, [props.pageId])

	return (
		<Link
			onClick={setPage}
		>
			more
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
					appDispatch={props.appDispatch}
					partId={partId}
					pageId={pageId}
				/>
			</>
		)
	}
}

function usePage(config: DocereConfig, pageId: string) {
	const [page, setPage] = React.useState<Page>(null)

	React.useEffect(() => {
		getPage(pageId, config).then(setPage)
	}, [pageId, config])

	return page	
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
			const page = usePage(props.config, 'bio')

			// if (props.attributes.target == null) return null
			// const type = (/^bio\.xml/.test(props.attributes.target)) ? 'person' : null
			// if (type == null) {
			// 	console.error(`Not implemented: ref[target="${props.attributes.target}"]`)
			// 	return null
			// }

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
			const page = usePage(props.config, 'biblio')

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
