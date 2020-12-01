import * as React from 'react'
import styled from 'styled-components';
import { ASIDE_WIDTH, AsideTab, Colors, FOOTER_HANDLE_HEIGHT, AsideTabContext } from '@docere/common'
import { EntitiesAside } from './text-data'

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
	const asideTab = React.useContext(AsideTabContext)

	return (
		<Wrapper>
			{/* TODO remove active check? Let metadata always render if there is metadata? */}
			{
				asideTab === AsideTab.Metadata &&
				<MetadataAside
					active={asideTab === AsideTab.Metadata}
				/>
			}
			{
				asideTab === AsideTab.TextData &&
				<EntitiesAside />
			}
			{/* {
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
