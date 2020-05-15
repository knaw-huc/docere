import React from 'react'
import styled from 'styled-components'
import { fetchPost } from '../../utils'
import { Entry, Hit, DocereConfig } from '@docere/common'
import type OpenSeadragon from 'openseadragon'
import { PanelsProps } from '.'
import ProjectContext from '../../app/context'
import { isHierarchyFacetConfig } from '@docere/search_'

function hitTest(position: OpenSeadragon.Point, viewer: OpenSeadragon.Viewer) {
	let box
	let count = viewer.world.getItemCount();

	for (var i = 0; i < count; i++) {
		box = viewer.world.getItemAt(i).getBounds()
		if (position.x > box.x && 
			position.y > box.y && 
			position.x < box.x + box.width &&
			position.y < box.y + box.height) {
			return i
		}
	}

	return -1
}

function canvasClickHandler(event: OpenSeadragon.ViewerEvent) {
	const { tileSources } = event.userData
	const viewer: OpenSeadragon.Viewer = event.userData.viewer
	const appDispatch: PanelsProps['appDispatch'] = event.userData.appDispatch
	// TODO what does quick do/tell?
	if (!event.quick) return
	const index = hitTest(viewer.viewport.pointFromPixel(event.position), viewer);
	if (index !== -1) {
		const tileSource = tileSources[index]
		setActiveFacsimiles(tileSource.userData.facsimiles, tileSources, viewer)
		setTimeout(() => {
			appDispatch({ type: 'SET_ENTRY_ID', id: tileSource.userData.id })
		}, 200)
	}
}

function arrange(viewer: OpenSeadragon.Viewer) {
	const count = viewer.world.getItemCount();
	let x = 0
	for (let i = 0; i < count; i++) {
		const tiledImage = viewer.world.getItemAt(i);
		const bounds = tiledImage.getBounds()
		bounds.x = x + (i * .1)
		tiledImage.fitBounds(bounds)
		x = x + bounds.width
	}
}

// function ff(viewer: OpenSeadragon.Viewer) {

// }

function useOpenSeadragon() {
	const [osd, setOsd] = React.useState<any>(null)

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
					showHomeControl: false,
					showZoomControl: false,
				})

				setOsd(viewer)
			})
	}, [])

	return osd
}

function useTileSources(
	collectionPayload: string,
	viewer: OpenSeadragon.Viewer,
	appDispatch: PanelsProps['appDispatch'],
	activeFacsimilePaths: string[],
	searchUrl: string
) {
	const [tileSources, setTileSources] = React.useState<any>([])

	React.useEffect(() => {
		if (viewer == null) return

		console.log('fetching')
		fetchPost(searchUrl, collectionPayload)
			.then(data => {
				const hits: Hit[] = data.hits.hits
				const tileSources = hits.reduce((prev, curr /*, index */) => {
					curr._source.facsimiles.forEach((f: string) => {
						prev.push({
							tileSource: f,
							// x: index + (.1 * index),
							// height: 1,
							userData: curr._source,
						})
					})
					return prev
				}, [])

				let count = 0
				function addItemHandler() {
					count += 1
					if (count === tileSources.length) {
						arrange(viewer)
						setActiveFacsimiles(activeFacsimilePaths, tileSources, viewer)
						viewer.world.removeHandler('add-item', addItemHandler)
						viewer.removeHandler('add-item-failed', addItemHandler)
					}
				}
				viewer.world.addHandler('add-item', addItemHandler)
				viewer.addHandler('add-item-failed', addItemHandler)

				tileSources.forEach(ts => viewer.addTiledImage(ts))
				setTileSources(tileSources)

				viewer.removeHandler('canvas-click', canvasClickHandler)
				viewer.addHandler('canvas-click', canvasClickHandler, { appDispatch, tileSources, viewer })

				viewer.addHandler('full-screen', () => {
					// fff(viewer)
					// console.log('VIEWER FULL SCREEN')
					viewer.gestureSettingsMouse.scrollToZoom = true
					viewer.panVertical = true
					setActiveFacsimiles(activeFacsimilePaths, tileSources, viewer)
				})
			})
	}, [collectionPayload, viewer])

	return tileSources
}

function setActiveFacsimiles(
	activeFacsimilePaths: string[],
	tileSources: any[],
	viewer: any
) {

	const bounds = activeFacsimilePaths
		.map(path => tileSources.findIndex(ts => ts.tileSource === path))
		.reduce((prev, curr) => {
			const item = viewer.world.getItemAt(curr)
			const bounds = item.getBounds()
			return prev == null ? bounds : prev.union(bounds)
		}, null as any)

	viewer.viewport.fitBounds(bounds)

	viewer.clearOverlays()
	const element = document.createElement("div")
	element.style.border = '3px solid orange'
	element.style.boxSizing = 'border-box'
	viewer.addOverlay({
		checkResize: false,
		element,
		location: bounds,
	})
}

function useActiveFacsimiles(entry: Entry) {
	const [activeFacsimiles, setActiveFacsimiles] = React.useState<string[]>([])

	React.useEffect(() => {
		const facsimilePaths = entry.facsimiles.reduce((prev, curr) => {
			const ps = curr.versions.map(v => v.path)
			return prev.concat(ps)
		}, [] as string[])

		setActiveFacsimiles(facsimilePaths)
	}, [entry])

	return activeFacsimiles
}

/*
 * Whenever the entry changes, the payload for the ElasticSearch query is
 * calculated. If the entry belongs to the same collection, the payload will
 * not be changed and a new search request is not triggered.
 */
function useCollectionPayload(entry: Entry, collection: DocereConfig['collection']) {
	const [payload, setPayload] = React.useState<string>(null)

	React.useEffect(() => {
		if (collection === true) return console.error('NOT IMPLEMENTED')
		if (collection === false) return

		const metadata = entry.metadata.find(md => md.id === collection.metadataId)

		if (metadata != null && isHierarchyFacetConfig(metadata)) {
			const term = metadata.value.reduce((prev, curr, index) => {
				prev.push({ term: { [`${collection.metadataId}_level${index}`]: curr }})
				return prev
			}, [])

			setPayload(JSON.stringify({
				"size": 10000,
				"query": {
					"bool": {
						"must": term
					}
				},
				"sort": collection.sortBy,
			}))
		} else {
			console.error('NOT IMPLEMENTED')
		}


	}, [entry, collection])

	return payload
}

const Container = styled.div`
	height: 64px;
`

interface Props {
	appDispatch: PanelsProps['appDispatch']
	entry: Entry
}
function CollectionNavigator(props: Props) {
	const context = React.useContext(ProjectContext)
	if (!context.config.collection) return null

	const osd = useOpenSeadragon()
	const collectionPayload = useCollectionPayload(props.entry, context.config.collection)
	const activeFacsimilePaths = useActiveFacsimiles(props.entry)
	useTileSources(collectionPayload, osd, props.appDispatch, activeFacsimilePaths, context.searchUrl)

	return (
		<Container
			id="osd_collection_navigator"
		/>
	)
}

export default React.memo(CollectionNavigator)
