import React from 'react'
import { Entity, EntryContext } from '@docere/common'
import IconsByType from './icons'

// export type ExtractEntityType = (props: DocereComponentProps) => string
// export type ExtractEntityKey = (props: DocereComponentProps) => string
// export type ExtractEntityValue = (props: DocereComponentProps) => React.ReactNode

export function useEntity(id: string) {
	const { entry } = React.useContext(EntryContext)
	const [entity, setEntity] = React.useState<Entity>(null)

	React.useEffect(() => {
		const _entity = entry.textData.entities.get(id)
		setEntity(_entity)
	}, [entry, id])

	return entity
}

// To prevent a wrap between the icon and the first word the first word is extracted.
// The icon and the first word are placed inside a span with white-space: nowrap.
export function useChildren(entityValue: React.ReactNode, entity: Entity): [React.ReactNode[], React.ReactNode, string] {
	const [children, setChildren] = React.useState<React.ReactNode[]>(entityValue as any)
	const [firstWord, setFirstWord] = React.useState<React.ReactNode>(null)
	const [restOfFirstChild, setRestOfFirstChild] = React.useState<string>(null)

	React.useEffect(() => {
		if (entity == null) return
		const children = React.Children.toArray(entityValue)
		let firstWord: React.ReactNode = entityValue
		let restOfFirstChild: string
		if (IconsByType.hasOwnProperty(entity.type) && children.length && typeof children[0] === 'string') {
			const [fw, ...rofc] = children[0].split(/\s/)
			firstWord = fw
			restOfFirstChild = rofc.length ? ' '.concat(rofc.join(' ')) : ''
		}

		setChildren(children)
		setFirstWord(firstWord)
		setRestOfFirstChild(restOfFirstChild)
	}, [entityValue, entity])

	return [children, firstWord, restOfFirstChild]
}
