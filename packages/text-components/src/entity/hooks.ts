import React from 'react'
import { Entity } from '@docere/common'
import IconsByType from './icons'

// export type ExtractEntityType = (props: DocereComponentProps) => string
// export type ExtractEntityKey = (props: DocereComponentProps) => string
// export type ExtractEntityValue = (props: DocereComponentProps) => React.ReactNode

type SplitChildren = [React.ReactNode, React.ReactNode, React.ReactNode]

/**
 * Split the children of an entity in firstChild, middleChildren and lastChild
 * 
 * Splitting is done to prevent a wrap between the icon (if there is one) and
 * the first word. The icon and the first word are placed inside a span with `white-space: nowrap`.
 * 
 * A tooltip can be shown on the first word or, if it is there, on the last word.
 * The container of the tooltip has `position: relative`, therefor the child must
 * be a string, in order to avoid rendering collisions when the child is a component.
 * That means if the first child is a component
 * 
 * @param children 
 * @param entity 
 * @returns first child, middle children and last child
 */
export function useChildren(children: React.ReactNode, entity: Entity): SplitChildren {
	const [splitChildren, setSplitChildren] = React.useState<SplitChildren>([null, null, null])

	React.useEffect(() => {
		if (entity == null) return
		let childrenArray = React.Children.toArray(children)

		if (!childrenArray.length) return

		if (
			IconsByType.hasOwnProperty(entity.props._config.type) &&
			typeof childrenArray[0] === 'string'
		) {
			const firstString = childrenArray.shift() as 'string'

			// Extract the first word from the first string
			const [firstWord, ...rest] = firstString.split(/\s/)

			// If there are more words, re-add the space, join the rest
			// and add it to the front of the childrenArray
			if (rest.length) {
				childrenArray.unshift(' '.concat(rest.join(' ')))
			}

			// Add the first word to the front of the childrenArray
			childrenArray.unshift(firstWord)
		}

		// If the only child is not a string, an empty string is added
		// to the array. The only child would get wrapped in a `position: relative`
		// <span> which could interfere with the non-string child's rendering
		if (
			childrenArray.length === 1 &&
			typeof childrenArray[0] !== 'string'
		) {
			childrenArray.push(' ')
		}

		const last = (childrenArray.length > 1) ? childrenArray.pop() : null
		const [first, ...middle] = childrenArray

		setSplitChildren([first, middle, last])
	}, [children, entity])

	return splitChildren
}
