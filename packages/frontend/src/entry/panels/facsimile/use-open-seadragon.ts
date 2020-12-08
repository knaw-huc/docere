import React from 'react'
import { addSvgOverlayFunctionality } from './svg-overlay'

export function useOpenSeadragon(): [any, any] {
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
