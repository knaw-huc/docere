import config from './config'
import extractFacsimiles from './facsimiles'
import extractMetadata from './metadata'
import extractEntities from './text-data'
import prepareDocument from './prepare'
import getComponents from './components'
import getUIComponent from './ui-components'
import { extendConfigData } from '@docere/common'

const docereConfigDataRaw: DocereConfigDataRaw = {
	config,
	extractFacsimiles,
	extractMetadata,
	extractEntities,
	getComponents,
	getUIComponent,
	prepareDocument
}

export default extendConfigData(docereConfigDataRaw)
