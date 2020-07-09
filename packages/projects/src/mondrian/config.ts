import { DocereConfig, EsDataType, RsType } from '@docere/common'

const config: DocereConfig = {
	slug: 'mondrian',
	title: 'The Mondrian Papers',
	private: true,
	metadata: [
		{
			id: 'date',
			datatype: EsDataType.Date,
			interval: 'y',
		}
	],
	pages: [
		{
			id: 'biblio',
			split: {
				extractId: (el) => el.getAttribute('xml:id'),
				selector: 'bibl',
			},
			title: 'Bibliography'
		},
		{
			id: 'bio',
			split: {
				extractId: (el) => el.getAttribute('xml:id'),
				selector: 'person',
			},
			title: 'Biographies'
		},
	],
	entities: [
		{
			id: 'person',
			type: RsType.Person,
		}
	]
}

export default config
