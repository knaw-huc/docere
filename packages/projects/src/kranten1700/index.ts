import config from './config'
import extractMetadata from './metadata'
import prepareDocument from './prepare'
import { extendConfigData } from '@docere/common'
import getComponents from './components'
import getUIComponent from './ui-components'
// import extractLayers from './text-layers'
// import extractEntities from './text-data'

export default extendConfigData({
	config,
	extractMetadata,
	getComponents,
	getUIComponent,
	prepareDocument,
	// extractEntities,
	// extractLayers,
})
