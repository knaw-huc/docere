import styled from 'styled-components'
import type { DocereComponentProps, ComponentProps } from '@docere/common'
import getPb from './pb'
import Popup from './popup'
import Entity from './entity'
import Tooltip, { TooltipBody } from './tooltip'
import getNote from './note'

const has = (rendAttribute: string, rendStyle: string) => rendAttribute.split(' ').indexOf(rendStyle) > -1
const Hi = styled.span`
	${(props: ComponentProps) => {
		const { rend } = props.attributes
		if (rend == null) return ''
		const rules = []
		if (has(rend, 'underline')) rules.push('text-decoration: underline;')
		if (has(rend, 'super')) rules.push('font-style: italic;')
		if (has(rend, 'italic') || has(rend, 'i')) rules.push('font-style: italic;')
		if (has(rend, 'spaced')) rules.push('letter-spacing: .1rem;')
		return rules.join('')
	}}
`

const Lb = styled.span`
	display: ${(props: DocereComponentProps) => props.entrySettings['panels.text.showLineBeginnings'] ? 'block' : 'inline' };

	&:before {
		box-sizing: border-box;
		color: #666;
		content: counter(linenumber);
		counter-increment: linenumber;
		display: ${(props) => props.entrySettings['panels.text.showLineBeginnings'] ? 'block' : 'none' };
		font-size: .8em;
		position: absolute;
		text-align: right;
		width: 42px;
		margin-left: -48px;
		padding-right: 8px;
	}
`

const Paragraph = styled.div`
	margin-bottom: 2.25rem;
`

export {
	getPb,
	Hi,
	Lb,
	getNote,
	Popup,
	Entity,
	Tooltip,
	TooltipBody,
	Paragraph,
}
