import config from './config'
import extractLayers from './textlayers'
import { extendConfigData } from '@docere/common'
import getComponents from './components'
import extractFacsimiles from './facsimiles'
import prepareDocument from './prepare'

const docereConfigDataRaw: DocereConfigDataRaw = {
	config,
	extractFacsimiles,
	extractLayers,
	getComponents,
	prepareDocument,
}

export default extendConfigData(docereConfigDataRaw)
