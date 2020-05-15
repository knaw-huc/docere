import config from './config'
import extractLayers from './textlayers'
import { extendConfigData } from '@docere/common'
import getComponents from './components'
import extractFacsimiles from './facsimiles'
import prepareDocument from './prepare'

export default extendConfigData({
	config,
	extractFacsimiles,
	extractLayers,
	getComponents,
	prepareDocument,
})
