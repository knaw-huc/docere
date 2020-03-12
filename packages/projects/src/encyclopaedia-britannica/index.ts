import config from './config'
import extractFacsimiles from './facsimiles'
import extractLayers from './layers'
// import prepareDocument from './prepare'
import extractMetadata from './metadata'
import getComponents from './components'
import { extendConfigData } from '@docere/common'

const docereConfigDataRaw: DocereConfigDataRaw = {
	config,
	getComponents,
	extractFacsimiles,
	extractLayers,
	extractMetadata,
	// prepareDocument
}

export default extendConfigData(docereConfigDataRaw)
