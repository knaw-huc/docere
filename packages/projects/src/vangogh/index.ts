import config from './config'
import extractMetadata from './metadata'
import extractFacsimiles from './facsimiles'
import { extendConfigData } from '@docere/common'
import getComponents from './components'
import getUIComponent from './ui-components'
import prepareDocument from './prepare'

import type { DocereConfigDataRaw } from '@docere/common'

const docereConfigDataRaw: DocereConfigDataRaw = {
	config,
	extractFacsimiles,
	extractMetadata,
	getComponents,
	getUIComponent,
	prepareDocument,
}

export default extendConfigData(docereConfigDataRaw)
