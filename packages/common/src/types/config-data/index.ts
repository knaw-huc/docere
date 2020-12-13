import type React from 'react'
import { ContainerType, UIComponentType } from '../../enum'
import type { DocereComponents } from '../components'
import { DocereConfig } from './config'
import { ID } from '../../entry/layer'

export * from './config'

export type GetComponents = (container: ContainerType, id?: string) => Promise<DocereComponents>

export type UIComponentsMap = Map<UIComponentType, Map<ID, React.FC<any>>>
export type GetUIComponents = () => Promise<{ default: UIComponentsMap }>

export type ProjectList = Record<string, {
	config: () => Promise<{ default: DocereConfig }>
	getTextComponents: () => Promise<{ default: (config: DocereConfig) => GetComponents }>
	getUIComponents?: GetUIComponents
}>
