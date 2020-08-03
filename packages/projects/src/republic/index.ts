import config from './config'
import { extendConfigData } from '@docere/common'
import getComponents from './components'

export default extendConfigData({
	config,
	getComponents,
})
