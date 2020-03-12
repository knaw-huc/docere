import config from './config'
import extractLayers from './textlayers'
import { extendConfigData } from '@docere/common'
import getComponents from './components'
import getUIComponent from './ui-components'
import extractFacsimiles from './facsimiles'
import prepareDocument from './prepare'
import extractMetadata from './metadata'
import extractEntities from './text-data'

const docereConfigDataRaw: DocereConfigDataRaw = {
	config,
	extractMetadata,
	extractFacsimiles,
	extractEntities,
	extractLayers,
	getComponents,
	getUIComponent,
	prepareDocument,
}

export default extendConfigData(docereConfigDataRaw)
