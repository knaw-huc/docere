import React from 'react'
import styled from 'styled-components'
import { Colors, Facsimile, EntryStateAction } from '@docere/common'

import CollectionNavigatorController from './controller'

function useOpenSeadragonController(
	facsimiles: Facsimile[],
	activeFacsimile: Facsimile,
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

				const collectionNavigatorController = new CollectionNavigatorController(viewer, facsimiles, activeFacsimile, handleClick)

				if (controller != null) controller.destroy()
				setController(collectionNavigatorController)
			})
	}, [])

	return controller
}

// function useEntry(controller: CollectionNavigatorController, entry: Entry) {
// 	React.useEffect(() => {
// 		if (controller == null) return
// 		controller.setEntry(entry)
// 	}, [controller, entry])
// }

const Container = styled.div`
	background: ${Colors.Grey};
	grid-column: 1 / -1;
	height: 64px;
`

interface Props {
	activeFacsimile: Facsimile
	entryDispatch: React.Dispatch<EntryStateAction>
	facsimiles: Facsimile[]
}
function CollectionNavigator(props: Props) {
	const handleClick = React.useCallback(id => {
		props.entryDispatch({
			type: "SET_ACTIVE_FACSIMILE",
			id,
		})	
	}, [])

	useOpenSeadragonController(
		props.facsimiles,
		props.activeFacsimile,
		handleClick,
	)

	return (
		<Container
			id="osd_collection_navigator"
		/>
	)
}

export default React.memo(CollectionNavigator)
