import React from 'react'

interface DelayedProps {
	children: React.ReactNode
	condition?: boolean
	milliseconds?: number
}
export default function Delayed(props: DelayedProps) {
	const [done, setDone] = React.useState(false)

	React.useEffect(() => {
		const milliseconds = props.milliseconds == null ? 1000 : props.milliseconds

		if (props.condition) {
			setTimeout(() => {
				setDone(true)
			}, milliseconds)
		} else {
			setDone(true)
		}
	}, [])

	if (!done) return null

	return <>{props.children}</>
}
