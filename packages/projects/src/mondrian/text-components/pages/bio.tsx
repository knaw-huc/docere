import React from 'react'
import styled from 'styled-components'
import { PageComponentProps } from '@docere/common'

function BirthDeath(props: PageComponentProps) {
	return (
		<div>
			{props.annotation.sourceProps.when}
			{props.children}
		</div>
	)
}

type PWProps = PageComponentProps & { ref?: any }
const PersonWrapper = styled.div.attrs((props: PWProps) => ({ id: props.annotation.sourceProps['xml:id'] }))`
	background: ${(props: PWProps) => props.activeId === props.annotation.sourceProps['xml:id'] ? 'green' : 'none'};
	margin-bottom: 1rem;
	min-height: 40px;
`

function useScrollIntoView(elementId: string, activeId: string) {
	const ref = React.useRef<HTMLLIElement>()

	React.useEffect(() => {
		if (elementId === activeId) ref.current.scrollIntoView()
	}, [elementId, activeId])

	return ref
}

export function Person(props: PageComponentProps) {
	const ref = useScrollIntoView(props.annotation.sourceProps['xml:id'], props.activeId)
	return (
		<PersonWrapper {...props} ref={ref}>
			{props.children}
		</PersonWrapper>
	)
}

export default async function pageComponents() {
	return {
		teiHeader: () => null as null,
		listPerson: styled.div``,
		person: Person,
		'persName[full="yes"]': styled.div`
			border-bottom: 1px solid #EEE;
			font-weight: bold;
		`,
		'persName[full="abb"]': () => null as null,
		'note[type="biographic"]': styled.div``,
		birth: BirthDeath,
		death: BirthDeath,
		settlement: styled.div`display: inline-block;`,
		country: styled.div`display: inline-block;`,
	}
}
