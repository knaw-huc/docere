import { formatDate, roundDownDate, roundUpDate, getTo, countMonths, countQuarters, countYears, countDays } from '../date.utils'

import type { DateInterval, RangeFacetValue, RangeFacetData } from '@docere/common'

function getBucketSize(range: number) {							/* range		= 240 */
	// Calculate the decimal multiplier: 10, 100, 1000, etc
	const base = Math.pow(10, (range.toString().length - 1))	/* base			= 10^2 = 100 */

	// Get to single digit and round to an integer
	const singleDigit = Math.round(range / base)				/* singleDigit	= 240/100 = 2.4 = 2 */

	return singleDigit * base / 10								/* return		= 2 * 100 / 10 = 20 */
}

// TODO rename to getRangeInterval
export function getRangeBucketSize(range: number) {				/* range		= 1000 */
	let base = Math.pow(10, (range.toString().length - 1))		/* base			= 10^3 = 1000 */
	if (range / base < 10) base = base / 2						/* base			= 500 */
	if (range / base < 10) base = base / 2						/* base 		= 250 */
	if (range / base < 10) base = base / 2.5					/* base			= 100 */
	if (base < 1) base = 1

	return base
}

function getBucketInfo(minDate: Date, maxDate: Date): [number, DateInterval] {
	// Year
	const yearRange = countYears(minDate, maxDate)
	if (yearRange >= 10) {
		return [getBucketSize(yearRange), 'y']
	}

	// Quarter
	const quartersRange = countQuarters(minDate, maxDate)
	if (quartersRange >= 10) {
		return [getBucketSize(quartersRange), 'q']
	}

	// Month
	const monthsRange = countMonths(minDate, maxDate)
	if (monthsRange >= 10) {
		return [getBucketSize(monthsRange), 'M']
	}

	// day
	const daysRange = countDays(minDate, maxDate)
	if (daysRange >= 10) {
		return [getBucketSize(daysRange), 'd']
	}

	if (daysRange < 1) console.error('NOT IMPLEMENTED')

	return [1, 'd']
}

// TODO rename to createDateBuckets
export default function createBuckets(minDate: Date, maxDate: Date): [RangeFacetValue[], DateInterval] {
	const [bucketSize, granularity] = getBucketInfo(minDate, maxDate)
	const firstDate = roundDownDate(minDate, granularity)
	const lastDate = roundUpDate(maxDate, granularity)
	const values: RangeFacetValue[] = []

	let date = firstDate
	while (date.getTime() < lastDate.getTime()) {
		const from = date.getTime()
		const toDate = getTo(date, bucketSize, granularity)
		const to = toDate.getTime()
		values.push(dateRangeToFacetValue(from, to, granularity))
		date = toDate
	}

	return [values, granularity]
}

export function createRangeBuckets(facet: RangeFacetData): RangeFacetValue[] {
	const values: RangeFacetValue[] = []

	const lastFilter = facet.filters[facet.filters.length - 1]
	let i = lastFilter.from
	while (i < lastFilter.to) {
		const to = i + facet.interval
		values.push(rangeToFacetValue(i, to))
		i = to
	}

	return values
}

export function dateRangeToFacetValue(from: number, to: number, granularity?: DateInterval): RangeFacetValue {
	if (granularity == null) {
		const bucketInfo = getBucketInfo(new Date(from), new Date(to))
		granularity = bucketInfo[1]
	}

	return {
		from,
		to, 
		fromLabel: formatDate(from, granularity),
		toLabel: formatDate(to, granularity),
		count: 0
	}
}

export function rangeToFacetValue(from: number, to: number) {
	return {
		from,
		to,
		fromLabel: from.toString(),
		toLabel: to.toString(),
		count: 0
	}
}
