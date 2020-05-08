import type { DateInterval } from '@docere/common'

export function getTo(date: Date, bucketSize: number, granularity: DateInterval) {
	if (granularity === 'y') {
		return new Date(Date.UTC(date.getUTCFullYear() + bucketSize, 0, 1, 0, 0, 0, 0))
	}

	if (granularity === 'q') {
		return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + (bucketSize * 3), 1, 0, 0, 0, 0))
	}

	if (granularity === 'M') {
		return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + bucketSize, 1, 0, 0, 0, 0))
	}

	if (granularity === 'd') {
		return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + bucketSize, 0, 0, 0, 0))
	}
}

export function countYears(minDate: Date, maxDate: Date) {
	return maxDate.getUTCFullYear() - minDate.getUTCFullYear()
}

export function countQuarters(minDate: Date, maxDate: Date) {
	const minQuarter = getQuarterFromDate(minDate)
	const maxQuarter = getQuarterFromDate(maxDate)
	const quartersFirstYear = (-1 * minQuarter) + 5
	const quartersMiddle = (countYears(minDate, maxDate) - 1) * 4
	return quartersFirstYear + quartersMiddle + maxQuarter
}

export function countMonths(minDate: Date, maxDate: Date) {
	return countYears(minDate, maxDate) * 12 + (maxDate.getMonth() - minDate.getMonth())
}

export function countDays(minDate: Date, maxDate: Date) {
	return (maxDate.getTime() - minDate.getTime()) / 1000 / 60 / 60 / 24
}

export function roundDownDate(date: Date, granularity: DateInterval): Date {
	if (granularity === 'y') {
		return new Date(Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0))
	}

	if (granularity === 'q') {
		const quarter = getQuarterFromDate(date)
		const month = (quarter * 3) - 3 /* first month of the quarter, 1 => 0, 2 => 3, 3 => 6, 4 => 9 */
		return new Date(Date.UTC(date.getUTCFullYear(), month, 1, 0, 0, 0, 0))
	}

	if (granularity === 'M') {
		return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0))
	}

	if (granularity === 'd') {
		return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0))
	}
}

export function roundUpDate(date: Date, granularity: DateInterval): Date {
	if (granularity === 'y') {
		return new Date(Date.UTC(date.getUTCFullYear() + 1, 0, 1, 0, 0, 0, 0))
	}

	if (granularity === 'q') {
		const quarter = getQuarterFromDate(date) + 1	/* get next quarter */
		const month = (quarter * 3) - 3 				/* first month of the next quarter, 1 => 0, 2 => 3, 3 => 6, 4 => 9 */
		return new Date(Date.UTC(date.getUTCFullYear(), month, 1, 0, 0, 0, 0))
	}

	if (granularity === 'M') {
		return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1, 0, 0, 0, 0))
	}

	if (granularity === 'd') {
		return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1, 0, 0, 0, 0))
	}
}

export function getQuarterFromDate(date: Date): number {
	return Math.ceil((date.getUTCMonth() + 1) / 3)
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatDate(timestamp: number, granularity: DateInterval): string {
	if (granularity == null) return null

	let date: string = ''
	const d = new Date(timestamp)
	const year = d.getUTCFullYear()

	if (granularity === 'y') {
		date = isNaN(year) ? '' : year.toString()
	}
	else if (granularity === 'q') {
		const quarter = getQuarterFromDate(d)
		date = isNaN(year) ? '' : `Q${quarter} ${year.toString()}`
	}
	else if (granularity === 'M') {
		date = `${months[d.getUTCMonth()]} ${year}`
	}
	else if (granularity === 'd' || granularity === 'h' || granularity === 'm') {
		date = `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${year}`
	}

	return date
}
