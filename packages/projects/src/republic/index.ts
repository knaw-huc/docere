import config from './config'
import { extendConfigData } from '@docere/common'
import getComponents from './components'
import extractMetadata from './metadata'
import extractFacsimiles from './facsimiles'

export default extendConfigData({
	config,
	extractFacsimiles,
	extractMetadata,
	getComponents,
})
