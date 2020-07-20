import config from './config'
import extractFacsimiles from './facsimiles'
import extractMetadata from './metadata'
import getComponents from './components'
import getUIComponent from './ui-components'
import extractText from './text'
import { extendConfigData } from '@docere/common'

export default extendConfigData({
	config,
	getComponents,
	getUIComponent,
	extractFacsimiles,
	extractMetadata,
	extractText,
})
