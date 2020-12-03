import React from 'react'
import styled from 'styled-components'
import { PANEL_HEADER_HEIGHT, FacsimileLayer, EntrySettingsContext, FacsimileContext, ProjectContext, DispatchContext, DocereComponentContainer, EntitiesContext, EntryContext } from '@docere/common'

import useAreaRenderer, { AreaRenderer } from './use-area-renderer'
import PanelHeader from '../header'
import CollectionNavigator2 from '../collection-navigator2'
import { formatTileSource } from './utils'

import { addSvgOverlayFunctionality } from './svg-overlay'
import { LayerProvider } from '../text/layer-provider'

// TODO change facsimile when user scroll past a <pb />

const Wrapper = styled.div`
	background: #BBB;
	position: sticky;
	top: 0;
	height: 100%;
	z-index: 1;

	.facsimile-area {
		border-width: 3px;
		border-style: solid;
		cursor: pointer;
		opacity: 0;
		pointer-events: none;
		transition: opacity 600ms;


		& > .facsimile-area-note {
			border-width: 3px;
			border-style: solid;
			box-sizing: border-box;
			color: white;
			left: -3px;
			min-width: calc(100% + 6px);
			opacity: 1;
			padding: .5rem;
			position: absolute;
			text-align: center;
			text-shadow: 1px 1px 1px #585858;
			top: 100%;
			transition: all 300ms;
		}						

		&.active {
			opacity: 1;
			z-index: 1;
		}

		&.show {
			pointer-events: all;

			&:not(.active):hover {
				opacity: .3;

				& > .facsimile-area-note {
					opacity: 0;
				}
			}

		}

	}
`

function useOpenSeadragon(): [any, any] {
	const [OpenSeadragon, setOpenSeadragon] = React.useState([null, null] as [any, any])

	React.useEffect(() => {
		import('openseadragon' as any)
			.then(OpenSeadragon => {
				addSvgOverlayFunctionality(OpenSeadragon)

				const osdInstance = OpenSeadragon.default({
					// crossOriginPolicy: 'Anonymous',
					constrainDuringPan: true,
					controlsFadeDelay: 0,
					controlsFadeLength: 300,
					gestureSettingsMouse: {
						clickToZoom: false,
						dblClickToZoom: true,
					},
					id: "openseadragon",
					navigatorPosition: 'TOP_RIGHT',
					// TODO only for Electron, remove before commit
					// prefixUrl: "/home/gijs/Projects/docere/node_modules/openseadragon/build/openseadragon/images/",
					prefixUrl: "/static/images/osd/",
					sequenceMode: true,
					showHomeControl: false,
					showNavigator: true,
					showReferenceStrip: true,
					showRotationControl: true,
					showZoomControl: false,
					visibilityRatio: 1.0,
				})

				setOpenSeadragon([osdInstance, OpenSeadragon])
			})
	}, [])

	return OpenSeadragon
}

/**
 * Show the active entities on the active facsimile. All the areas
 * are already rendered, but activation makes them visible.
 * 
 * @param areaRenderer 
 */
function useActiveFacsimileAreas(areaRenderer: AreaRenderer) {
	const activeFacsimile = React.useContext(FacsimileContext)
	const activeEntities = React.useContext(EntitiesContext)

	React.useEffect(() => {
		if (areaRenderer == null) return
		areaRenderer.activate(activeEntities)
	}, [activeFacsimile, activeEntities, areaRenderer])
}

/**
 * Add the current active facsimile to OpenSeadragon. After opening,
 * render the facsimile areas on the SVG overlay. 
 * 
 * @param areaRenderer 
 * @param osd 
 */
function useActiveFacsimile(
	areaRenderer: AreaRenderer,
	osd: any
) {
	const activeFacsimile = React.useContext(FacsimileContext)
	const entry = React.useContext(EntryContext)

	React.useEffect(() => {
		if (areaRenderer == null || activeFacsimile == null || osd == null) return

		function openHandler() {
			areaRenderer.render(entry, activeFacsimile)
			osd.removeHandler('open', openHandler)
		}

		osd.addHandler('open', openHandler)

		osd.open(formatTileSource(activeFacsimile))
	}, [areaRenderer, entry, activeFacsimile])
}

const Container = styled.div`
	height: ${(props: { hasHeader: boolean }) => {
		let subtract = 0 		
		if (props.hasHeader) subtract += PANEL_HEADER_HEIGHT
		return `calc(100% - ${subtract}px)`
	}}
`

type Props = {
	layer: FacsimileLayer
}

function FacsimilePanel(props: Props) {
	const dispatch = React.useContext(DispatchContext)
	const { config } = React.useContext(ProjectContext)
	const settings = React.useContext(EntrySettingsContext)
	const [osd, OpenSeadragon] = useOpenSeadragon()

	const handleAreaClick = React.useCallback((ev: any) => {
		const { area } = ev.userData
		dispatch({
			type: 'ADD_ENTITY',
			entityId: area.target.id,
			triggerContainer: DocereComponentContainer.Layer,
			triggerContainerId: props.layer.id
		})
	}, [props.layer.id])
	const areaRenderer = useAreaRenderer(osd, OpenSeadragon, handleAreaClick)

	useActiveFacsimile(areaRenderer, osd)
	useActiveFacsimileAreas(areaRenderer)

	return (
		<LayerProvider value={props.layer}>
			<Wrapper className="facsimile-panel">
				{
					settings['panels.showHeaders'] &&
					<PanelHeader
						layer={props.layer}
					>
						{props.layer.title}
					</PanelHeader>
				}
				<Container
					hasHeader={settings['panels.showHeaders']}
					id="openseadragon"
				/>
				{
					props.layer.facsimiles.size > 1 &&
					config.collection == null &&
					<CollectionNavigator2
						layer={props.layer}
					/>
				}
			</Wrapper>
		</LayerProvider>
	)
}

export default React.memo(FacsimilePanel)
