import config from './config'
import extractFacsimiles from './facsimiles'
import extractLayers from './layers'
// import prepareDocument from './prepare'
import extractMetadata from './metadata'
import getComponents from './components'
import { extendConfigData } from '@docere/common'

export default extendConfigData({
	config,
	getComponents,
	extractFacsimiles,
	extractLayers,
	extractMetadata,
	// prepareDocument
})
