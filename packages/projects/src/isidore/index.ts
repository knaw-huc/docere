import config from './config'
import { extendConfigData } from '@docere/common'
import getComponents from './components'
import extractFacsimiles from './facsimiles'

export default extendConfigData({
	config,
	extractFacsimiles,
	getComponents,
})
