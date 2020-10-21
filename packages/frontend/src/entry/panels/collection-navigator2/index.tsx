import React from 'react'
import styled from 'styled-components'
import { Facsimile, EntryStateAction, FacsimileLayer } from '@docere/common'

import CollectionNavigatorController from './controller'

function useOpenSeadragonController(
	facsimiles: Facsimile[],
	handleClick: (id: string) => void
) {
	const [controller, setController] = React.useState<any>(null)

	React.useEffect(() => {
		import('openseadragon')
			.then(OpenSeadragon => {
				const viewer = OpenSeadragon.default({
					gestureSettingsMouse: {
						clickToZoom: false,
						scrollToZoom: false,
					},
					id: "osd_collection_navigator2",
					prefixUrl: "/static/images/osd/",
					panVertical: false,
					preserveImageSizeOnResize: true,
					showHomeControl: false,
					showZoomControl: false,
				})

				const collectionNavigatorController = new CollectionNavigatorController(viewer, facsimiles, handleClick)
				setController(collectionNavigatorController)
			})

		return () => {
			controller?.viewer.destroy()
			controller?.destroy()
		}
	}, [facsimiles])

	return controller
}

function useActiveFacsimile(controller: CollectionNavigatorController, activeFacsimile: Facsimile) {
	React.useEffect(() => {
		if (controller == null) return
		controller.setActiveFacsimile(activeFacsimile)
	}, [controller, activeFacsimile])
}

const Container = styled.div`
	background: rgba(0, 0, 0, .5);
	bottom: 0;
	height: 64px;
	position: absolute;
	width: 100%;
`

interface Props {
	entryDispatch: React.Dispatch<EntryStateAction>
	layer: FacsimileLayer
}
function CollectionNavigator(props: Props) {
	const handleClick = React.useCallback(id => {
		props.entryDispatch({
			id,
			triggerLayer: props.layer,
			type: "SET_FACSIMILE",
		})	
	}, [])

	const controller = useOpenSeadragonController(
		props.layer.facsimiles,
		handleClick,
	)

	useActiveFacsimile(controller, props.layer.activeFacsimile)

	return (
		<Container
			id="osd_collection_navigator2"
		/>
	)
}

export default React.memo(CollectionNavigator)
