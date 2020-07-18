import config from './config'
import extractFacsimiles from './facsimiles'
// import extractLayers from './layers'
// import prepareDocument from './prepare'
import extractMetadata from './metadata'
import getComponents from './components'
import getUIComponent from './ui-components'
import extractText from './text'
import { extendConfigData } from '@docere/common'

export default extendConfigData({
	config,
	getComponents,
	getUIComponent,
	extractFacsimiles,
	// extractLayers,
	extractMetadata,
	extractText,
	// prepareDocument
})
