import config from './config'
// import extractMetadata from './metadata'
// import extractFacsimiles from './facsimiles'
import { extendConfigData } from '@docere/common'
// import getComponents from './components'
// import getUIComponent from './ui-components'
// import prepareDocument from './prepare'

// import type { DocereConfigDataRaw } from '@docere/common'

// const docereConfigDataRaw: DocereConfigDataRaw = {
// 	config,
// 	// getComponents,
// 	// getUIComponent,
// }

export default extendConfigData(config)

// 	extractFacsimiles,
// 	extractMetadata,
// 	prepareDocument,
