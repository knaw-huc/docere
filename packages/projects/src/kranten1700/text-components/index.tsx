import * as React from 'react'
import styled from 'styled-components'
import { DocereComponentContainer } from '@docere/common'
import type { DocereConfig, DocereComponents } from '@docere/common'
import { getEntity, PopupBodyProps } from '@docere/text-components'

const Dl = styled.dl`
	line-height: 1rem;
	margin: 0;
	padding: 1rem;

	& > div {
		margin-bottom: 1rem;
	}

	dt {
		color: #888;
		font-size: .66rem;
		text-transform: uppercase;
	}

	dt, dd {
		margin: 0;
		padding: 0;
	}

	dd {
		font-size: 1rem;
	}
`

function RsBody(props: PopupBodyProps) {
	const { attributes } = props.docereComponentProps
	return (
		<Dl>
			<div>
				<dt>Origineel</dt>
				<dd>{attributes.value}</dd>
			</div>
			<div>
				<dt>Contemporain</dt>
				<dd>{attributes.contemporary}</dd>
			</div>
			<div>
				<dt>pos</dt>
				<dd>{attributes.pos}</dd>
			</div>
			<div>
				<dt>pos sub</dt>
				<dd>{attributes.possub}</dd>
			</div>
			{
				attributes.type &&
				<div>
					<dt>NER type</dt>
					<dd>{attributes.type}</dd>
				</div>
			}
		</Dl>
	)
}

// function w(config: DocereConfig) {
// 	return function(props: DocereComponentProps) {
// 		return (
// 			<Entity
// 				customProps={props}
// 				entitiesConfig={config.entities}
// 				entityId={props.attributes.id}
// 				PopupBody={RsBody}
// 				configId={props.attributes.type}
// 			>
// 				{props.attributes.value}
// 			</Entity>
// 		)
// 	}
// }

export default function(_config: DocereConfig) {
	return async function(_container: DocereComponentContainer, _id: string): Promise<DocereComponents> {
		const components: DocereComponents = {
			head: styled.h3`
				font-size: 1.2em;
				margin: 0;
			`,
			p: styled.div`
				margin-bottom: 1em;

				${(props: any) => props._class === 'subheader' ?
					'font-size: 1.1em;' : ''
				}
			`,
			s: styled.div``,
			// w: w(config),
			w: getEntity({
				// extractType: () => 'word',
				extractKey: props => props.attributes.pos,
				extractValue: props => props.attributes.value,
				PopupBody: RsBody,
			})
		}
		return components
	}
}
