import * as React from 'react'
import styled from '@emotion/styled'
import AppContext from '../../../app/context'
import useAreaRenderer, { AreaRenderer } from './use-area-renderer'

// TODO change facsimile when user scroll past a <pb />

const Wrapper = styled.div`
	background: white;
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
				const osdInstance = OpenSeadragon.default({
					constrainDuringPan: true,
					controlsFadeDelay: 0,
					controlsFadeLength: 300,
					gestureSettingsMouse: {
						clickToZoom: false,
						dblClickToZoom: true,
					},
					id: "openseadragon",
					navigatorPosition: 'BOTTOM_LEFT',
					// TODO only for Electron, remove before commit
					// prefixUrl: "/home/gijs/Projects/docere/node_modules/openseadragon/build/openseadragon/images/",
					prefixUrl: "/static/images/osd/",
					sequenceMode: true,
					showHomeControl: false,
					showReferenceStrip: true,
					showRotationControl: true,
					showZoomControl: false,
					showNavigator: true,
					visibilityRatio: 1.0,
				})
				setOpenSeadragon([osdInstance, OpenSeadragon])
			})
	}, [])

	return OpenSeadragon
}

function useActiveFacsimileAreas(activeFacsimileAreas: FacsimileArea[], areaRenderer: AreaRenderer) {
	React.useEffect(() => {
		if (areaRenderer == null || activeFacsimileAreas == null) return
		areaRenderer.activate(activeFacsimileAreas)
	}, [activeFacsimileAreas, areaRenderer])
}

function useActiveFacsimile(
	activeFacsimile: Props['activeFacsimile'],
	projectId: DocereConfig['slug'],
	areaRenderer: AreaRenderer,
	osd: any
) {
	React.useEffect(() => {
		if (areaRenderer == null || activeFacsimile == null) return
		// const facsimile = this.props.facsimiles.find(f => f.id === this.props.activeFacsimilePath)
		// TODO acativeFacsimilePath should be activeFacsimileID
		// TODO find the paths in this.props.facsimiles with activeFacsimileID
		let path = activeFacsimile.versions[0].path as any
		
		// TODO Move logic to vangogh facsimileExtractor (path should be a string of a tileSource)
		if (projectId === 'vangogh') {
			path = { tileSource: { type: 'image', url: path.slice(0, -5).concat('f.png'), buildPyramid: false } }
		}

		function openHandler() {
			// renderFacsimileAreas(osd, , OpenSeadragon, entryDispatch)
			areaRenderer.render(activeFacsimile.versions[0].areas)
			osd.removeHandler('open', openHandler)
		}

		osd.addHandler('open', openHandler)
		
		osd.open(path)
	}, [areaRenderer, activeFacsimile])

}

type Props =
	Pick<EntryState, 'activeFacsimile' | 'activeFacsimileAreas'> & {
		entryDispatch: React.Dispatch<EntryStateAction>
	}

function FacsimilePanel(props: Props) {
	const appContext = React.useContext(AppContext)
	const [osd, OpenSeadragon] = useOpenSeadragon()
	const areaRenderer = useAreaRenderer(osd, OpenSeadragon, props.entryDispatch)

	useActiveFacsimile(props.activeFacsimile, appContext.config.slug, areaRenderer, osd)
	useActiveFacsimileAreas(props.activeFacsimileAreas, areaRenderer)

	return (
		<Wrapper className="facsimile-panel">
			<div id="openseadragon" style={{ height: '100%' }}></div>
		</Wrapper>
	)
}

export default React.memo(FacsimilePanel)
