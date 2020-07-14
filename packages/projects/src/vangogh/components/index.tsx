import React from 'react'
import styled from 'styled-components'
import { getNote, getPb, Entity, Lb } from '@docere/text-components'
import { DocereComponentContainer, DocereComponentProps, EntityConfig, DocereConfig, useUIComponent, UIComponentType, Hit } from '@docere/common'

// const Ref = styled.span`border-bottom: 1px solid green;`
// const ref = function(props: DocereComponentProps) {
// 	const handleClick = React.useCallback((ev: React.MouseEvent<HTMLSpanElement>) => {
// 		ev.stopPropagation()
// 		const [entryFilename, noteId] = props.attributes.target.split('#')
// 		let query: NavigatePayload['query']
// 		if (noteId != null && noteId.length) {
// 			query = {
// 				type: 'note',
// 				id: noteId,
// 			}
// 		}
	
// 		props.navigate({
// 			type: 'entry',
// 			id: entryFilename.slice(0, -4),
// 			query
// 		})
// 	}, [])

// 	return (
// 		<Ref onClick={handleClick}>
// 			{props.children}
// 		</Ref>
// 	)
// }


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

function RefPopupBody(props: DocereComponentProps) {
	const result = useSearchResult(props.activeEntity?.id)
	const ResultBodyComponent = useUIComponent(UIComponentType.SearchResult)
	if (ResultBodyComponent == null || result == null) return null
	return (
		<div>
			<ResultBodyComponent {...props} result={result} />
		</div>
	)
}

// function DocumentLink

function person(entitiesConfig: EntityConfig[]) {
	return function Person(props: DocereComponentProps) {
		return (
			<Entity
				configId={props.attributes.type}
				customProps={props}
				entitiesConfig={entitiesConfig}
				entityId={props.attributes.key}
			>
				{props.children}
			</Entity>
		)
	}
}

// const getComponents: GetComponents = function(config: DocereConfig) {
export default function getComponents(config: DocereConfig) {
	return async function(_container: DocereComponentContainer, _id: string) {
		// const personConfig = config.entities.find(td => td.id === 'pers')
		return {
			ab: styled.div`margin-bottom: 1rem;`,
			anchor: getNote((props => props.attributes['xml:id'])),
			// anchor: (props: DocereComponentProps) =>
			// 	<Note
			// 		{...props}
			// 		id={props.attributes['xml:id']}
			// 		n={props.attributes.n}
			// 		title={`Note ${props.attributes.n}`}
			// 	/>, 
			// lb: (props: DocereComponentProps) => <Lb showLineBeginnings={props.entrySettings['panels.text.showLineBeginnings']} />,
			lb: Lb,
			pb: getPb(props => { 
				console.log('GETTING PB')
				return props.attributes.facs.slice(1) }),
			// ref,
			'ref[target]': (props: DocereComponentProps) => {
				// const page = usePage('biblio')

				// const biblioId = /^biblio\.xml#(.*)$/.exec(props.attributes.target)[1]
				const [entryFilename, noteId] = props.attributes.target.split('#')
				noteId
				const entityId = entryFilename.slice(0, -4)

				// if (page == null) return null
				return (
					<Entity
						customProps={props}
						entitiesConfig={config.entities}
						entityId={entityId}
						configId={'ref'}
						PopupBody={RefPopupBody}
					>
						{props.children}
					</Entity>
				)
			},
			'rs': person(config.entities),
		}
	}
}
