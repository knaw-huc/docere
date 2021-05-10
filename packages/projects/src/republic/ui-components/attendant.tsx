import React from 'react'
import styled from 'styled-components'
import { EntityComponentProps, EntityWithLinkWrapper, LinkFooter, EntityWrapper } from '@docere/ui-components'

const Wrapper = styled.div`
	padding: 1rem;
`

function AttendantEntityBody(props: EntityComponentProps) {
	return (
		<EntityWrapper
			entity={props.entity}
		>
			<EntityWithLinkWrapper>
				<Wrapper>
					<h2>{props.entity.props.delegate_name}</h2>
					<div>
						<div>ID: {props.entity.props.delegate_id}</div>
						<div>CLASS: {props.entity.props.class}</div>
					</div>
				</Wrapper>
				<LinkFooter
					entity={props.entity}
				>
					<a
						href=""
						onClick={ev => ev.stopPropagation()}
						target="_blank"
					>
						see TSD
					</a>
				</LinkFooter>
			</EntityWithLinkWrapper>
		</EntityWrapper>
	)
}
export const AttendantEntity = React.memo(AttendantEntityBody)
