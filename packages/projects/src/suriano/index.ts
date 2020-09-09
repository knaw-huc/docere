import config from './config'
import { extendConfigData } from '@docere/common'
import getComponents from './components'
import prepareDocument from './prepare'
import extractFacsimiles from './facsimiles'

export default extendConfigData({
	config,
	extractFacsimiles,
	getComponents,
	prepareDocument
})
