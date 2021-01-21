import { extendConfigData } from '@docere/common'
import keys from '../data/keys.json'

const projectId = 'ecodicesnl'

export default extendConfigData({
	slug: projectId,
	title: "e-Codices NL",
	private: true,
	metadata: keys.map(key => ({
		id: key,
		extract: entry => entry.preparedElement.querySelector(`meta[key="${key}"]`)?.textContent
	})),
	layers: [
	],
})
