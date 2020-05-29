import { extendConfigData } from '@docere/common'

import config from './config'
import extractFacsimiles from './facsimiles'
import extractLayers from '../plakaatboek-guyana-1670-1816/layers'
import extractMetadata from './metadata'
import getComponents from '../plakaatboek-guyana-1670-1816/components'
import prepareDocument from '../plakaatboek-guyana-1670-1816/prepare'

export default extendConfigData({
	config,
	extractFacsimiles,
	extractLayers,
	extractMetadata,
	prepareDocument,
	getComponents,
})
