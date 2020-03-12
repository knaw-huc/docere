import * as React from 'react'
import styled from '@emotion/styled'
import getResultBody, { ResultBodyProps } from '../result-body';

const Label = styled.div`
	color: #888;
	font-size: .85em;
	text-transform: uppercase;
`

const PersonName = styled.span`
`

function Sex(props: { sex: Gender }) {
	if (props.sex == null) return null
	return <span>{`(${props.sex.slice(0, 1).toLowerCase()})`} </span>
}

type Gender = 'Man' | 'Vrouw'
enum SoRType { Sender, Recipient }
interface SoRProps {
	type: SoRType
	result: {
		recipient: string
		recipientgender: Gender
		recipientloc: string
		sender: string
		sendergender: Gender
		senderloc: string
		texttypes: string
	}
}
function has(item: string) { return item != null && item.trim().length }
function SenderOrRecipient(props: SoRProps) {
	const label = props.type === SoRType.Sender ? 'Zender' : 'Ontvanger'
	const personName = props.type === SoRType.Sender ? props.result.sender : props.result.recipient
	const sex = props.type === SoRType.Sender ? props.result.sendergender : props.result.recipientgender
	const loc = props.type === SoRType.Sender ? props.result.senderloc : props.result.recipientloc
	const hasPersonName = has(personName)
	const hasLocation = has(loc)

	if (!hasPersonName && !hasLocation) return null

	return (
		<div>
			<Label>{label}</Label>
			{
				hasPersonName &&
				<>
					<PersonName>{personName} </PersonName>
					<Sex sex={sex} />
				</>
			}
			{
				hasLocation &&
				<div>{`vanuit ${loc}`}</div>
			}
		</div>
	)
}

function MetadataItems(props: ResultBodyProps) {
	return (
		<>
			{
				props.result.date != null && props.result.date.length &&
				<div>
					<Label>Datum</Label>
					<div>{props.result.date}</div>
				</div>
			}
			<SenderOrRecipient
				result={props.result as any}
				type={SoRType.Sender}
			/>
			<SenderOrRecipient
				result={props.result as any}
				type={SoRType.Recipient}
			/>
			{

				props.result.texttypes.filter((tt: string) => tt !== 'Onbekend').length > 0 &&
				<div>
					<Label>Tekstsoort</Label>
					{
						props.result.texttypes
							.filter((tt: string) => tt !== 'Onbekend')
							.join(', ')
					}
				</div>
			}
			{
				props.result.languages.length > 0 &&
				<div>
					<Label>Taal</Label>
					{ props.result.languages.join(', ') }
				</div>
			}
		</>
	)
}


export default getResultBody(MetadataItems)
