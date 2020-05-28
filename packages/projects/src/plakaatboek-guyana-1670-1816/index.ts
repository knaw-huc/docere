import config from './config'
import extractLayers from './layers'
import { extendConfigData } from '@docere/common'
import getComponents from './components'
import prepareDocument from './prepare'
import extractMetadata from './metadata'

export default extendConfigData({
	config,
	extractLayers,
	extractMetadata,
	prepareDocument,
	getComponents,
})
