import React from 'react'
import { Editor } from './editor'
import styled from 'styled-components'
import { setProjectConfig, useSourceState } from './state'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'

export function Upload() {
	const [state, dispatch] = useSourceState()

	return (
		<Wrapper>
			<header>
				<h1>UPLOADING</h1>
			</header>
			<Main>
				<section>
					<input
						type="file"
						onChange={ev => {
							dispatch({ type: 'SET_FILE', file: ev.target.files[0] })
						}}
					/>
				</section>
				<section>
					<input
						onChange={ev => {
							dispatch({ type: 'SET_JSON_QUERY', jsonQuery: ev.target. value })
						}}
						placeholder="Filter JSON"
						type="text"
					/>
					<button onClick={() => {
						setProjectConfig(dispatch)
					}}>
						Reload config
					</button>
				</section>
				<Tabs defaultIndex={2}>
					<TabList>
						<Tab disabled={state.source == null}>Source</Tab>
						<Tab disabled={state.standoffTree == null}>Standoff tree</Tab>
						<Tab disabled={state.entries.length === 0}>Entries</Tab>
					</TabList>
					<TabPanel>
						<section id="source">
							{
								state.source != null &&
								<Editor
									language={state.projectConfig.documents.type === 'xml' ? 'xml' : 'json'}
									value={state.source}
								/>
							}
						</section>
					</TabPanel>
					<TabPanel>
						<section id="standoff-tree">
							{
								state.standoffTree != null &&
								<>
								<Editor
									language="json"
									value={JSON.stringify(state.standoffTree.standoff)}
								/>
								<ul>
									<li>metadata items: {Object.keys(state.standoffTree.standoff.metadata).length}</li>
									<li>
										annotations: {Object.keys(state.standoffTree.annotations).length}
										<ul>
											{
												Array.from(
													state.standoffTree.annotations
														.reduce((prev, curr) => {
															if (prev.has(curr.name)) {
																prev.set(curr.name, prev.get(curr.name) + 1)
															} else {
																prev.set(curr.name, 1)
															}

															return prev
														}, new Map() as Map<string, number>)
												)
													.map(([name, count]) =>
														<li key={name}>{name} - {count}</li>
													)
											}
										</ul>
									</li>
									<li>text: {Object.keys(state.standoffTree.standoff.text).length}</li>
								</ul>
								</>
							}
						</section>
					</TabPanel>
					<TabPanel>
						<div id="entries">
							<section>
								{
									Object.keys(state.entriesByPartId)
										.map(key =>
											<div key={key}>
												<h3>{key}</h3>
												<ol>
													{
														state.entriesByPartId[key].map(entry =>
															<li
																className={entry.id === state.entry?.id ? 'active' : null}
																key={entry.id}
																onClick={() => dispatch({ type: 'SET_ENTRY', entry })}
																title={entry.id}
															>
																{console.log(entry.id)}
																{entry.id}
															</li>
														)
													}
												</ol>
											</div>
										)
								}
							</section>
							{
								state.json != null &&
								<Editor
									language="json"
									value={state.json}
								/>
							}
						</div>
					</TabPanel>
				</Tabs>
			</Main>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	display: grid;
	grid-template-rows: 100px calc(100vh - 100px);

	.react-tabs {
		position: absolute;
		right: 0;
		left: 0;
		bottom: 0;
		top: 200px;

		.react-tabs__tab-panel {
			height: calc(100% - 45px);
		}
	}

	#source, #standoff-tree {
		display: grid;
		height: 100%;
		width: 100%;
	}

	#standoff-tree {
		grid-template-columns: auto 200px;

		& > ul > li {
			margin-bottom: 1rem;

			& > ul {
				color: #444;
				font-size: .8rem;
				margin-left: 1rem;
			}

		}
	}

	#entries {
		display: grid;
		grid-template-columns: 320px auto;
		height: 100%;

		& > section {
			background: #222;
			color: #FFF;
			font-size: .75rem;
			overflow-x: auto;
			padding: .5rem;
		}

		h3 {
			margin: 1rem 0 .25rem 0;
		}

		ol {
			padding-left 1.25rem;

			li {
				cursor: pointer;
				white-space: nowrap;

				&:hover {
					color: lightblue;
				}

				&.active {
					color: #00bfff;
				}
			}
		}
	}
`

const Main = styled.section`
`
