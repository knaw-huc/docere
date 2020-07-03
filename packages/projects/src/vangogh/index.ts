import config from './config'
import extractMetadata from './metadata'
import extractNotes from './notes'
import extractFacsimiles from './facsimiles'
import extractEntities from './text-data'
import extractLayers from './textlayers'
import { extendConfigData } from '@docere/common'
import getComponents from './components'
import getUIComponent from './ui-components'
import prepareDocument from './prepare'

import type { DocereConfigDataRaw } from '@docere/common'

const docereConfigDataRaw: DocereConfigDataRaw = {
	config,
	extractFacsimiles,
	extractMetadata,
	extractNotes,
	extractEntities,
	extractLayers,
	getComponents,
	getUIComponent,
	prepareDocument,
}

export default extendConfigData(docereConfigDataRaw)
