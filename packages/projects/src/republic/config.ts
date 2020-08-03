import { LayerType } from '@docere/common'

import type { DocereConfig } from '@docere/common'

const config: DocereConfig = {
	slug: 'republic',
	title: 'Republic',
	collection: {
		metadataId: 'toegang',
		sortBy: 'n'
	},
	// metadata: [],
	entities: [],
	layers: [
		{
			id: 'scan',
			type: LayerType.Facsimile
		},
		{
			id: 'text',
			type: LayerType.Text
		},
	]
}

export default config
