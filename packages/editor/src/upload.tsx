import React from 'react'
import { Editor } from './editor'
import styled from 'styled-components'
import { setProjectConfig, useSourceState } from './state'

export function Upload() {
	const [state, dispatch] = useSourceState()

	return (
		<Wrapper>
			<header>
				<h1>UPLOADING</h1>
				<section>
					<input
						type="file"
						onChange={ev => {
							dispatch({ type: 'SET_FILE', file: ev.target.files[0] })
						}}
					/>
				</section>
				<input
					type="text"
					onChange={ev => {
						dispatch({ type: 'SET_JSON_QUERY', jsonQuery: ev.target. value })
					}}
				/>
				<button onClick={() => {
					setProjectConfig(dispatch)
				}}>
					Reload config
				</button>
			</header>
			<Main>
				<ul className="entry-list">
					{
						state.entries.map(entry =>
							<EntryLi
								key={entry.id}
								onClick={() => dispatch({ type: 'SET_ENTRY', entry })}
								title={entry.id}
							>
								{entry.id}
							</EntryLi>
						)
					}
				</ul>
				{
					state.json != null &&
					<Editor
						language="json"
						value={state.json}
					/>
				}
			</Main>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	display: grid;
	grid-template-rows: 20vh 80vh;
	overflow: hidden;

	.entry-list {
		grid-column: 2;
	}

	.Editor {
		grid-column: 3;
	}
`

const Main = styled.section`
	display: grid;
	grid-template-columns: 32px 200px auto 32px;
	height: 100%;
`

const EntryLi = styled.li`
	color: blue;
	cursor: pointer;
	white-space: nowrap;

	&:hover {
		color: black;
	}
`
