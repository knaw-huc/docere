import React from 'react'
import { ContainerContext, ContainerType, ID, ContainerContextValue } from '@docere/common'

interface Props {
	children: React.ReactNode
	type: ContainerType
	id: ID
}
export function ContainerProvider(props: Props) {
	const [value, setValue] = React.useState<ContainerContextValue>()

	React.useEffect(() => {
		setValue({ type: props.type, id: props.id })
	}, [props.type, props.id])

	return (
		<ContainerContext.Provider value={value}>
			{props.children}
		</ContainerContext.Provider>
	) 
}
