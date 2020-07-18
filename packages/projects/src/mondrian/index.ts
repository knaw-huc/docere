import config from './config'
import { extendConfigData } from '@docere/common'
// import extractEntities from './entities'
import extractFacsimiles from './facsimiles'
// import extractLayers from './layers'
import extractMetadata from './metadata'
// import extractNotes from './notes'
import getComponents from './components'

import type { DocereConfigDataRaw } from '@docere/common'

const docereConfigDataRaw: DocereConfigDataRaw = {
	config,
	// extractEntities,
	extractFacsimiles,
	// extractLayers,
	extractMetadata,
	// extractNotes,
	getComponents,
}

export default extendConfigData(docereConfigDataRaw)
