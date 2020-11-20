import { extendConfigData } from '@docere/common'
import keys from '../data/keys.json'

export default extendConfigData({
	slug: 'ecodicesnl',
	title: "e-Codices NL",
	private: true,
	metadata: keys.map(key => ({
		id: key,
		extract: entry => entry.preparedElement.querySelector(`meta[key="${key}"]`)?.textContent
	})),
	layers: [
	],
})
