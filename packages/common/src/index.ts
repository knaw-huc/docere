/// <reference path="./types/index.d.ts" />

// Import React for the type defs in ./types/*.d.ts
import 'react'

// Re-export
export * from './enum'
export * from './constants'

// Export extendConfigData
import extendConfigData, { defaultMetadata } from './extend-config-data'
export { extendConfigData, defaultMetadata }

