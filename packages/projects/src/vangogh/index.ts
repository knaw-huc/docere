import config from './config'
import extractMetadata from './metadata'
import extractNotes from './notes'
import extractFacsimiles from './facsimiles'
import extractEntities from './text-data'
import extractLayers from './textlayers'
import { extendConfigData } from '@docere/common'
import type { DocereConfigDataRaw } from '@docere/common'
import getComponents from './components'
import prepareDocument from './prepare'

const docereConfigDataRaw: DocereConfigDataRaw = {
	config,
	extractFacsimiles,
	extractMetadata,
	extractNotes,
	extractEntities,
	extractLayers,
	getComponents,
	prepareDocument,
}

export default extendConfigData(docereConfigDataRaw)
