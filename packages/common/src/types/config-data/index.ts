import type React from 'react'
import { DocereComponentContainer, UIComponentType } from '../../enum'
import type { DocereComponents } from '../components'
import { DocereConfig } from './config'

export * from './config'

export type GetComponents = (container: DocereComponentContainer, id?: string) => Promise<DocereComponents>
export type GetUIComponent = (componentType: UIComponentType, id?: string) => Promise<React.FC<any>>

export type ProjectList = Record<string, {
	config: () => Promise<{ default: DocereConfig }>
	getTextComponents: () => Promise<{ default: (config: DocereConfig) => GetComponents }>
	getUIComponent?: () => Promise<{ default: (config: DocereConfig) => GetUIComponent }>
}>
