import * as React from 'react'
import styled from 'styled-components';
import { ASIDE_WIDTH, AsideTab, Colors, FOOTER_HANDLE_HEIGHT, EntryTabContext } from '@docere/common'

import MetadataAside from './metadata/index'

const Wrapper = styled.aside`
	background-color: ${Colors.Grey};
	bottom: ${FOOTER_HANDLE_HEIGHT}px;
	box-sizing: border-box;
	color: #EEE;
	height: 100%;
	position: absolute;
	right: -${ASIDE_WIDTH}px;
	top: 0;
	width: ${ASIDE_WIDTH}px;
	z-index: 6000;
`

function Aside() {
	const { asideTab } = React.useContext(EntryTabContext)

	return (
		<Wrapper>
			{/* TODO remove active check? Let metadata always render if there is metadata? */}
			{
				asideTab === AsideTab.Metadata &&
				<MetadataAside
					active={asideTab === AsideTab.Metadata}
				/>
			}
			{/* {
				props.asideTab === AsideTab.TextData &&
				<TextDataAside
					active={props.asideTab === AsideTab.TextData}
					activeEntity={props.activeEntity}
					appDispatch={props.appDispatch}
					entryDispatch={props.entryDispatch}
					layers={props.layers}
					entities={props.entry.entities}
				/>
			}
			{
				props.asideTab === AsideTab.Notes &&
				<NotesAside
					active={props.asideTab === AsideTab.Notes}
					activeEntity={props.activeEntity}
					activeFacsimile={props.activeFacsimile}
					activeFacsimileAreas={props.activeFacsimileAreas}
					activeNote={props.activeNote}
					appDispatch={props.appDispatch}
					entry={props.entry}
					entryDispatch={props.entryDispatch}
					entrySettings={props.entrySettings}
				/>
			} */}
		</Wrapper>
	)
}

export default React.memo(Aside)
