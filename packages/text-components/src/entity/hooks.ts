import React from 'react'
import { Entity } from '@docere/common'
import IconsByType from './icons'

// export type ExtractEntityType = (props: DocereComponentProps) => string
// export type ExtractEntityKey = (props: DocereComponentProps) => string
// export type ExtractEntityValue = (props: DocereComponentProps) => React.ReactNode

// To prevent a wrap between the icon and the first word the first word is extracted.
// The icon and the first word are placed inside a span with white-space: nowrap.
export function useChildren(entityValue: React.ReactNode, entity: Entity): [React.ReactNode, React.ReactNode] {
	// const [children, setChildren] = React.useState<React.ReactNode[]>(entityValue as any)
	const [firstWord, setFirstWord] = React.useState<React.ReactNode>(entityValue)
	const [restOfFirstChild, setRestOfFirstChild] = React.useState<React.ReactNode[]>(null)

	React.useEffect(() => {
		if (entity == null) return
		let children = React.Children.toArray(entityValue)
		let restOfFirstChild: string
		if (IconsByType.hasOwnProperty(entity.props._config.type) && children.length) {
			if (typeof children[0] !== 'string') {
				setFirstWord(' ')
				setRestOfFirstChild(children)
			} else {
				const [firstWord, ...rest] = children[0].split(/\s/)
				restOfFirstChild = rest.length ? ' '.concat(rest.join(' ')) : ''

				setFirstWord(firstWord)
				setRestOfFirstChild([restOfFirstChild].concat(children.slice(1) as any))
			}
		}
	}, [entityValue, entity])

	return [firstWord, restOfFirstChild]
}
