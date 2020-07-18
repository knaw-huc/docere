import config from './config'
import { extendConfigData } from '@docere/common'
// import extractLayers from './layers'
import getComponents from './components'
import extractFacsimiles from './facsimiles'
// import extractNotes from './notes'
// import prepareDocument from './prepare'

export default extendConfigData({
	config,
	extractFacsimiles,
	// extractLayers,
	// extractNotes,
	getComponents,
	// prepareDocument,
})
