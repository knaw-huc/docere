import React from 'react'
import styled from 'styled-components'
import { Facsimile, EntryStateAction, FacsimileLayer, Entry, EntryState } from '@docere/common'

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

		return () => {
			controller?.viewer.destroy()
			controller?.destroy()
		}
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
	activeFacsimiles: EntryState['activeFacsimiles']
	entry: Entry
	entryDispatch: React.Dispatch<EntryStateAction>
	layer: FacsimileLayer
}
function CollectionNavigator(props: Props) {
	const handleClick = React.useCallback(id => {
		props.entryDispatch({
			id,
			layerId: null,
			triggerLayerId: props.layer.id,
			type: "SET_FACSIMILE",
		})	
	}, [])

	const controller = useOpenSeadragonController(
		props.entry,
		props.layer,
		handleClick,
	)

	useActiveFacsimile(controller, props.activeFacsimiles.values().next().value)

	return (
		<Container
			id="osd_collection_navigator2"
		/>
	)
}

export default React.memo(CollectionNavigator)
