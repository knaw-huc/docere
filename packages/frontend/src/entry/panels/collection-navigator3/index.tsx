import React from 'react'
import styled from 'styled-components'
import { Colors, EntryContext, FacsimileContext, DispatchContext } from '@docere/common'

import CollectionNavigatorController from './controller'

function useOpenSeadragonController() {
	const dispatch = React.useContext(DispatchContext)
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

				const collectionNavigatorController = new CollectionNavigatorController(viewer, dispatch)

				if (controller != null) controller.destroy()
				setController(collectionNavigatorController)
			})
	}, [])

	return controller
}

function useEntry(controller: CollectionNavigatorController) {
	const entry = React.useContext(EntryContext)
	const activeFacsimile = React.useContext(FacsimileContext)

	React.useEffect(() => {
		if (controller == null) return
		controller.setEntry(entry, activeFacsimile)
	}, [controller, entry])

	React.useEffect(() => {
		if (controller == null) return
		controller.setActiveFacsimile(activeFacsimile)
	}, [controller, activeFacsimile])
}

const Container = styled.div`
	background: ${Colors.Grey};
	bottom: 0;
	height: 64px;
	position: absolute;
	width: 100%;
`

function CollectionNavigator() {
	const controller = useOpenSeadragonController()
	useEntry(controller)

	return (
		<Container
			id="osd_collection_navigator"
		/>
	)
}

export default React.memo(CollectionNavigator)
