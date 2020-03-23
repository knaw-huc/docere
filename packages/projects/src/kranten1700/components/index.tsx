import * as React from 'react'
import styled from 'styled-components'
import { DocereComponentContainer } from '@docere/common'
import { Entity } from '@docere/text-components'

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

function RsBody(props: DocereComponentProps) {
	return (
		<Dl>
			<div>
				<dt>Origineel</dt>
				<dd>{props.attributes.value}</dd>
			</div>
			<div>
				<dt>Contemporain</dt>
				<dd>{props.attributes.contemporary}</dd>
			</div>
			<div>
				<dt>pos</dt>
				<dd>{props.attributes.pos}</dd>
			</div>
			<div>
				<dt>pos sub</dt>
				<dd>{props.attributes.possub}</dd>
			</div>
			{
				props.attributes.type &&
				<div>
					<dt>NER type</dt>
					<dd>{props.attributes.type}</dd>
				</div>
			}
		</Dl>
	)
}

function w(config: DocereConfig) {
	return function(props: DocereComponentProps) {
		return (
			<Entity
				customProps={props}
				entitiesConfig={config.entities}
				id={props.attributes.id}
				PopupBody={RsBody}
				configId={props.attributes.type}
			>
				{props.attributes.value}
			</Entity>
		)
	}
}

export default function(config: DocereConfig) {
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
			w: w(config),
		}
		return components
	}
}
