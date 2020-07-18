import type React from 'react'
import { DocereComponentContainer, UIComponentType } from '../../enum'
import type { DocereConfig } from './config'
import type { DocereConfigFunctions } from './functions'
import type { DocereComponents } from '../components'

export * from './functions'
export * from './config'
export * from './layer'

export interface DocereConfigData extends DocereConfigFunctions {
	// getComponents: GetComponents
	getComponents?: (config: DocereConfig) => GetComponents
	getUIComponent?: (config: DocereConfig) => GetUIComponent
	config: DocereConfig
}

export type GetComponents = (container: DocereComponentContainer, id?: string) => Promise<DocereComponents>
export type GetUIComponent = (componentType: UIComponentType, id?: string) => Promise<React.FC<any>>

// TODO is used much? only in 1 place? move there?
export type DocereConfigDataRaw = Partial<DocereConfigData>
