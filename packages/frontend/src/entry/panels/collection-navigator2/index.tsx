import React from 'react'
import styled from 'styled-components'
import { Facsimile, EntryStateAction, FacsimileLayer } from '@docere/common'

import CollectionNavigatorController from './controller'

function useOpenSeadragonController(
	facsimiles: Facsimile[],
	// activeFacsimile: Facsimile,
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
					id: "osd_collection_navigator",
					prefixUrl: "/static/images/osd/",
					panVertical: false,
					preserveImageSizeOnResize: true,
					showHomeControl: false,
					showZoomControl: false,
				})

				const collectionNavigatorController = new CollectionNavigatorController(viewer, facsimiles, handleClick)

				if (controller != null) controller.destroy()
				setController(collectionNavigatorController)
			})
	}, [])

	return controller
}

function useActiveFacsimile(controller: CollectionNavigatorController, activeFacsimile: Facsimile) {
	React.useEffect(() => {
		if (controller == null) return
		controller.setActiveFacsimile(activeFacsimile)
	}, [controller, activeFacsimile])
}
// function useEntry(controller: CollectionNavigatorController, entry: Entry) {
// 	React.useEffect(() => {
// 		if (controller == null) return
// 		controller.setEntry(entry)
// 	}, [controller, entry])
// }

const Container = styled.div`
	background: rgba(0, 0, 0, .5);
	bottom: 0;
	height: 64px;
	position: absolute;
	width: 100%;
`

interface Props {
	activeFacsimile: Facsimile
	entryDispatch: React.Dispatch<EntryStateAction>
	layer: FacsimileLayer
}
function CollectionNavigator(props: Props) {
	const handleClick = React.useCallback(id => {
		props.entryDispatch({
			id,
			triggerLayer: props.layer,
			type: "SET_ACTIVE_FACSIMILE",
		})	
	}, [])

	const controller = useOpenSeadragonController(
		props.layer.facsimiles,
		// props.activeFacsimile,
		handleClick,
	)

	useActiveFacsimile(controller, props.activeFacsimile)

	return (
		<Container
			id="osd_collection_navigator"
		/>
	)
}

export default React.memo(CollectionNavigator)
