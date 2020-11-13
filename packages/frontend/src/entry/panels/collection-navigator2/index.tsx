import React from 'react'
import styled from 'styled-components'
import { Facsimile, FacsimileLayer, Entry, FacsimileContext, EntryContext } from '@docere/common'

import CollectionNavigatorController from './controller'

function useOpenSeadragonController(
	entry: Entry,
	layer: FacsimileLayer,
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

				const collectionNavigatorController = new CollectionNavigatorController(viewer, entry, layer, handleClick)
				setController(collectionNavigatorController)
			})

		// return () => {
		// 	controller?.viewer.destroy()
		// 	controller?.destroy()
		// }
	}, [entry, layer])

	return controller
}

function useActiveFacsimile(controller: CollectionNavigatorController, activeFacsimile: Facsimile) {
	React.useEffect(() => {
		if (controller == null || activeFacsimile == null) return
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
	// entry: Entry
	// entryDispatch: React.Dispatch<EntryStateAction>
	layer: FacsimileLayer
}
function CollectionNavigator(props: Props) {
	const entry = React.useContext(EntryContext)
	const { activeFacsimile, setActiveFacsimile } = React.useContext(FacsimileContext)

	const handleClick = React.useCallback(id => {
		setActiveFacsimile(id, props.layer.id, null)
		// props.entryDispatch({
		// 	id,
		// 	layerId: null,
		// 	triggerLayerId: props.layer.id,
		// 	type: "SET_FACSIMILE",
		// })	
	}, [])

	const controller = useOpenSeadragonController(
		entry,
		props.layer,
		handleClick,
	)

	useActiveFacsimile(controller, activeFacsimile)

	return (
		<Container
			id="osd_collection_navigator2"
		/>
	)
}

export default React.memo(CollectionNavigator)
