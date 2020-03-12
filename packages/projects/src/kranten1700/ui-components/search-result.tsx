import * as React from 'react'
import styled from 'styled-components'
import { ResultBody } from '@docere/ui-components'

const H3 = styled.h3`margin: 0;`
const H4 = styled.h4`margin: 0;`

function GekaapteBrievenResultBody(props: ResultBodyProps) {
	let locations: any[] = []
	if (Array.isArray(props.result.loc)) locations = locations.concat(props.result.loc)
	if (Array.isArray(props.result.locactions)) locations = locations.concat(props.result.locations)

	return (
		<ResultBody {...props}>
			<H3>{props.result.paper_title}</H3>
			<H4>{props.result.article_title}</H4>
			<span>{new Date(Date.parse(props.result.date)).toDateString()}</span>
		</ResultBody>
	)
}


export default React.memo(GekaapteBrievenResultBody)
