import * as React from 'react'
import styled from 'styled-components'
import Layers from './layers'
import Settings from './settings'
import Downloads from './downloads'
import { FOOTER_HEIGHT, FOOTER_HANDLE_HEIGHT, FooterTab, SearchTab, AsideTab, AppStateAction, AppState, Colors, useNavigate } from '@docere/common'
import type { Facsimile, EntryState, EntryStateAction, Entry, DocereConfig } from '@docere/common'

const Wrapper = styled.footer`
	background: ${Colors.Grey};
	display: grid;
	grid-template-rows: ${FOOTER_HANDLE_HEIGHT}px auto;
	height: ${FOOTER_HEIGHT + FOOTER_HANDLE_HEIGHT}px;
	left: 0;
	pointer-events: none;
	position: fixed;
	right: 0;
	z-index: 6001;

	& > * {
		pointer-events: all;
	}
`

const MenuItems = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	height: ${FOOTER_HANDLE_HEIGHT}px;
	line-height: ${FOOTER_HANDLE_HEIGHT}px;
	padding: 0 8px;

	& > .footer-tabs {
		justify-self: center;
	}

	& > .aside-tabs {
		justify-self: end;
	}
`

interface BProps { active: boolean }
const Button = styled.div`
	color: ${(props: BProps) => props.active ? Colors.Orange : '#BBB'};
	cursor: pointer;
	display: inline-block;
	font-size: .8rem;
	padding: 0 .33rem;

	&:hover {
		color: ${(props: BProps) => props.active ? Colors.Orange : '#EEE'};
	}
`

const Body = styled.div`
	background-color: black;
	color: white;
	position: relative;
`

function isEmpty(obj: Object | Array<any>) {
	if (obj == null) return true
	if (Array.isArray(obj)) return obj.length === 0
	return Object.keys(obj).length === 0
}


interface Props {
	activeFacsimile: Facsimile
	appDispatch: React.Dispatch<AppStateAction>
	footerTab: AppState['footerTab']
	asideTab: EntryState['asideTab']
	layers: EntryState['layers']
	entryDispatch: React.Dispatch<EntryStateAction>
	entry: Entry
	entrySettings: DocereConfig['entrySettings']
	searchTab: AppState['searchTab']
}
function Footer(props: Props) {
	const navigate = useNavigate()

	const handleTabClick = React.useCallback(ev => {
		const { tab, type } = ev.target.dataset
		if (tab === SearchTab.Search) {
			navigate()
		} else if (type === 'aside') {
			props.entryDispatch({ type: 'TOGGLE_TAB', tabType: type, tab })			
		} else if (type === 'search' || type === 'footer') {
			props.appDispatch({ type: 'TOGGLE_TAB', tabType: type, tab })
		}
	}, [])


	return (
		<Wrapper>
			<MenuItems onClick={handleTabClick}>
				<div className="search-tabs">
					<Button
						active={props.searchTab === SearchTab.Search}
						data-tab={SearchTab.Search}
						data-type="search"
					>
							Search
					</Button>
					<Button
						active={props.searchTab === SearchTab.Results}
						data-tab={SearchTab.Results}
						data-type="search"
					>
						Results
					</Button>
				</div>
				<div className="footer-tabs">
					<Button
						active={props.footerTab === FooterTab.Layers}
						data-tab={FooterTab.Layers}
						data-type="footer"
					>
						Layers
					</Button>
					<Button
						active={props.footerTab === FooterTab.Settings}
						data-tab={FooterTab.Settings}
						data-type="footer"
					>
							Settings
					</Button>
					<Button
						active={props.footerTab === FooterTab.API}
						data-tab={FooterTab.API}
						data-type="footer"
					>
						API
					</Button>
				</div>
				<div className="aside-tabs">
					{
						!isEmpty(props.entry.metadata) &&
						<Button
							active={props.asideTab === AsideTab.Metadata}
							data-tab={AsideTab.Metadata}
							data-type="aside"
						>
							Metadata
						</Button>
					}
					{/* {
						!isEmpty(props.entry.entities) &&
						<Button
							active={props.asideTab === AsideTab.TextData}
							data-tab={AsideTab.TextData}
							data-type="aside"
						>
							Entities
						</Button>
					}
					{
						!isEmpty(props.entry.notes) &&
						<Button
							active={props.asideTab === AsideTab.Notes}
							data-tab={AsideTab.Notes}
							data-type="aside"
						>
							Notes
						</Button>
					} */}
				</div>
			</MenuItems>
			<Body>
				<Layers
					active={props.footerTab === FooterTab.Layers}
					activeFacsimile={props.activeFacsimile}
					dispatch={props.entryDispatch}
					layers={props.layers}
				/>
				<Settings
					active={props.footerTab === FooterTab.Settings}
					dispatch={props.entryDispatch}
					entrySettings={props.entrySettings}
				/>
				<Downloads
					active={props.footerTab === FooterTab.API}
					entry={props.entry}
				/>

			</Body>
		</Wrapper>
	)
}

export default React.memo(Footer)
