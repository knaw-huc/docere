import * as React from 'react'
import styled from 'styled-components'
import { ResultBody } from '@docere/ui-components'
import type { DocereResultBodyProps } from '@docere/common'

export const Label = styled.div`
	color: #888;
	font-size: .85em;
	text-transform: uppercase;
`

const Metadata = styled.div`
	& > div {
		margin-bottom: 1rem;

		&:last-of-type {
			margin-bottom: 0;
		}
	}
`

const ignoredKeys = ['facsimiles', 'snippets', 'text']

function GenericResultBody(props: DocereResultBodyProps) {
	return (
		<ResultBody {...props}>
			<Metadata>
				{
					Object.keys(props.result)
						.filter(key => ignoredKeys.indexOf(key) === -1)
						.map(key => {
							const value = props.result[key]
							return (
								<div key={key}>
									<Label>{key}</Label>
									{
										Array.isArray(value) ?
											<ul>{value.map((v, i) => <li key={i}>{v}</li>)}</ul> :
											<div>{value}</div>
									}
								</div>
							)
						})
				}
			</Metadata>
		</ResultBody>
	)
}


export default React.memo(GenericResultBody)
