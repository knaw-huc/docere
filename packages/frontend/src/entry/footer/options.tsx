import React from 'react'
import styled from 'styled-components'
import type { DocereConfig } from '@docere/common'

const Option = styled.li`
	color: #CCC;
	font-size: .8rem;

	&:hover {
		color: #FFF;
	}

	& > input {
		cursor: pointer;
		margin-right: .5rem;
		outline: 0;
	}

	& > label {
		cursor: pointer;
		user-select: none;
	}
`

interface SettingsOption { prop: keyof DocereConfig['entrySettings'], title: string }

interface Props {
	checked: boolean
	option: SettingsOption
	onClick: (ev: any) => void
}
export default function SettingsOption(props: Props) {
	return (
		<Option
			onClick={props.onClick}
			data-prop={props.option.prop}
		>
			<input
				checked={props.checked}
				onChange={() => false}
				type="checkbox"
			/>
			<label>{props.option.title}</label>
		</Option>
	)
}
