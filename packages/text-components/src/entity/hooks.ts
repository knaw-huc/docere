import React from 'react'
import { defaultEntityConfig, setTitle } from '@docere/common'
import IconsByType, { IconProps } from './icons'

// The config is a state of an Entity, because the config can be null,
// in which case a default config is loaded.
export function useConfig(configId: string, entitiesConfig: EntityConfig[]) {
	const [config, setConfig] = React.useState(null)

	React.useEffect(() => {
		let config

		if (configId != null && entitiesConfig != null) {
			config = entitiesConfig.find(ec => ec.id === configId)
		}

		if (config == null) config = setTitle(defaultEntityConfig)

		setConfig(config)
	}, [entitiesConfig, configId])

	return config
}

// To prevent a wrap between the icon and the first word the first word is extracted.
// The icon and the first word are placed inside a span with white-space: nowrap.
export function useChildren(propsChildren: React.ReactNode, config: EntityConfig): [React.ReactNode[], React.ReactNode, string, React.FC<IconProps>] {
	const [Icon, setIcon] = React.useState<React.FC<IconProps>>(null)
	const [children, setChildren] = React.useState<React.ReactNode[]>(null)
	const [firstWord, setFirstWord] = React.useState<React.ReactNode>(null)
	const [restOfFirstChild, setRestOfFirstChild] = React.useState<string>(null)

	React.useEffect(() => {
		const children = React.Children.toArray(propsChildren)
		let firstWord: React.ReactNode = propsChildren
		let restOfFirstChild: string
		const Icon = IconsByType[config?.type]
		if (Icon != null && children.length && typeof children[0] === 'string') {
			const [fw, ...rofc] = children[0].split(/\s/)
			firstWord = fw
			restOfFirstChild = rofc.length ? ' '.concat(rofc.join(' ')) : ''
		}

		setChildren(children)
		setFirstWord(firstWord)
		setIcon(Icon)
		setRestOfFirstChild(restOfFirstChild)
	}, [])

	return [children, firstWord, restOfFirstChild, Icon]
}
