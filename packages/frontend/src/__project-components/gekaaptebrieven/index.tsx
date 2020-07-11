/// <reference path="../../types/index.d.ts" />

import * as React from 'react'
import { AsideTab } from '../../constants'
import { rsPlace, rsPerson, Rs } from '../rs'
import getPb from '../pb';

const getComponents: GetComponents = function(config) {
	const placeConfig = config.textdata.find(td => td.id === 'loc')
	const personConfig = config.textdata.find(td => td.id === 'person')

	const components: DocereComponents = {
		'ner[type="loc"]': rsPlace(placeConfig),
		'ner[type="per"]': rsPerson(personConfig),
		pb: getPb((props) => props.facs),
	}

	// Map all the text data configs to components. Person and Loc are overwritten later
	config.textdata
		.filter(td => td.id !== 'person' && td.id !== 'loc')
		.forEach(td => {
			components[td.extractor.selector] = function(props: any) {
				return (
					<Rs
						{...props}
						active={props.activeListId === td.id && props.activeId === props.children[0]}
						color={td.color}
						onClick={() => props.setActiveId(props.children[0], td.id, AsideTab.TextData)}
					/>
				)
			}
		})

	return components
}

export default getComponents
