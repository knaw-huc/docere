
// export function getEndDate(timestamp: number, interval: string): number {
// 	if (interval == null) return null
// 	const date = new Date(timestamp)
// 	const count = parseInt(interval.slice(0, -1))
// 	const intervalChar = interval.slice(-1)

// 	const yearMultiplier = intervalChar === 'y' ? count : 0
// 	const monthMultiplier = intervalChar === 'M' ? count : 0
// 	const dateMultiplier = (intervalChar === 'd' || intervalChar === 'h' || intervalChar === 's') ? count : 0
// 	const nextYear = date.getUTCFullYear() + yearMultiplier
// 	const nextMonth = date.getUTCMonth() + monthMultiplier
// 	const nextDate = date.getUTCDate() + dateMultiplier

// 	return new Date(nextYear, nextMonth, nextDate).getTime()
// }

// export function ratioToTimestamp(ratio: number, values: RangeFacetValues) {
// 	const minValue = values[0].key
// 	const maxValue = values[values.length - 1].key
// 	return Math.floor(minValue + (ratio * (maxValue - minValue)))
// }

// export function timestampToRatio(timestamp: number, values: RangeFacetValues) {
// 	const minValue = values[0].key
// 	const maxValue = values[values.length - 1].key
// 	return (timestamp - minValue) / (maxValue - minValue)
// }

// function formatRange(facetData: RangeFacetData, rangeMin: number, rangeMax: number): [number | string, number | string] {
// 	if (facetData.type === 'number') return [rangeMin, rangeMax]

// 	const dateMin = new Date(rangeMin)
// 	const yearMin = dateMin.getUTCFullYear()

// 	const dateMax = new Date(rangeMax)
// 	const yearMax = dateMax.getUTCFullYear()

// 	return [formatDate(facetData, rangeMin, yearMin === yearMax), formatDate(facetData, rangeMax)]
// }
