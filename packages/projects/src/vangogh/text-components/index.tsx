import styled from 'styled-components'
import { getNote, Pb, getEntity, Lb, EntryLinkPopupBody, NoteLinkPopupBody } from '@docere/text-components'
import { DocereComponentContainer, DocereConfig } from '@docere/common'

export default function getComponents(_config: DocereConfig) {
	return async function(_container: DocereComponentContainer, _id: string) {
		// const personConfig = config.entities.find(td => td.id === 'pers')
		return {
			ab: styled.div`margin-bottom: 1rem;`,
			anchor: getNote(props => {
				// console.log(props.attributes)
				return props.attributes.target
			}),
			// anchor: (props: DocereComponentProps) =>
			// 	<Note
			// 		{...props}
			// 		id={props.attributes['xml:id']}
			// 		n={props.attributes.n}
			// 		title={`Note ${props.attributes.n}`}
			// 	/>, 
			// lb: (props: DocereComponentProps) => <Lb showLineBeginnings={props.entrySettings['panels.text.showLineBeginnings']} />,
			lb: Lb,
			// pb: getPb(props => props.attributes.facs.slice(1)),
			pb: Pb,
			// ref,
			'ref[target][type="entry-link"]': getEntity({
				// extractType: () => 'entry-link',
				extractKey: props => props.attributes.target.replace(/\.xml$/, ''),
				PopupBody: EntryLinkPopupBody
			}),
			'ref[target][type="note-link"]': getEntity({
				// extractType: () => 'note-link',
				extractKey: props => props.attributes.target,
				PopupBody: NoteLinkPopupBody
			}),
			// 'ref[target]': (props: DocereComponentProps) => {
			// 	// const page = usePage('biblio')

			// 	// const biblioId = /^biblio\.xml#(.*)$/.exec(props.attributes.target)[1]
			// 	const [entryFilename, noteId] = props.attributes.target.split('#')
			// 	noteId
			// 	const entityId = entryFilename.slice(0, -4)

			// 	// if (page == null) return null
			// 	return (
			// 		<Entity
			// 			customProps={props}
			// 			entitiesConfig={config.entities}
			// 			entityId={entityId}
			// 			configId={'ref'}
			// 			PopupBody={RefPopupBody}
			// 		>
			// 			{props.children}
			// 		</Entity>
			// 	)
			// },
			// 'rs': person(config.entities),
			rs: getEntity()
				// {
				// extractType: props => props.attributes.type,
				// extractKey: props => props.attributes.key
			// })
		}
	}
}
