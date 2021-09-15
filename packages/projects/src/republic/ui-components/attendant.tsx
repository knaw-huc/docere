import React from 'react'
import styled from 'styled-components'
import { EntityComponentProps, EntityWithLinkWrapper, LinkFooter, EntityWrapper } from '@docere/ui-components'

const Wrapper = styled.div`
	padding: 1rem;

	h2 {
		font-size: 1rem;
		margin: 0 0 .5rem 0;

		small {
			color: gray;
			font-size: .85rem;
			padding-left: .3rem;
		}

	}
`

function AttendantEntityBody(props: EntityComponentProps) {
	return (
		<EntityWrapper
			entity={props.entity}
		>
			<EntityWithLinkWrapper>
				<Wrapper>
					{
						props.entity.sourceMetadata.delegate_name.length > 0 &&
						<h2>
							{props.entity.sourceMetadata.delegate_name}
							<small>
								({props.entity.sourceMetadata.delegate_id})
							</small>
						</h2>
					}
					<div>{props.entity.sourceMetadata.class}</div>
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
