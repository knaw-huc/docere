import React from 'react'
import styled from 'styled-components'
import { getNote, getPb, Lb, Hi, Paragraph, getEntity, PagePopupBody } from '@docere/text-components'
import { Colors } from '@docere/common'

import type { DocereComponentProps, DocereConfig } from '@docere/common'

function MondrianLb(props: DocereComponentProps) {
	return (
		<>
			<Lb {...props} />
			{
				props.entrySettings['panels.text.showLineBeginnings'] &&
				props.attributes.rend?.indexOf('indent') > -1 &&
				<span>&nbsp;&nbsp;</span>
			}
		</>
	)
}

export default async function entryComponents(_config: DocereConfig) {
	return {
		// Show <add> in green in the diplomatic version and in default color in the read version
		add: styled.span`
			color: ${(props: DocereComponentProps) => props.entrySettings['panels.text.showLineBeginnings'] ? Colors.Green : 'initial'};
		`,
		// Show <del> in red in the diplomatic version and hide in the read version
		del: styled.span`
			color: ${Colors.Red};
			display: ${(props: DocereComponentProps) => props.entrySettings['panels.text.showLineBeginnings'] ? 'inline' : 'none'};
		`,
		lb: MondrianLb,
		pb: getPb(props => props.attributes.facs?.slice(1)),
		ptr: getNote(props => props.attributes.target.slice(1)),
		hi: Hi,
		p: Paragraph,
		'ref[target^="bio.xml#"]': getEntity({
			extractType: () => 'bio',
			extractKey: props => /^bio\.xml#(.*)$/.exec(props.attributes.target)[1],
			PopupBody: PagePopupBody
		}),
		'ref[target^="biblio.xml#"]': getEntity({
			extractType: () => 'biblio',
			extractKey: props => /^biblio\.xml#(.*)$/.exec(props.attributes.target)[1],
			PopupBody: PagePopupBody
		})
	}

}
