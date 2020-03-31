import * as React from 'react'
import styled from 'styled-components'
import PageNumber, { Button } from './page-number'
import type { FSResponse } from '@docere/common'

function getRange(start: number, end: number) {
	return Array.from({length: end - start + 1}, (_value, key) => key + start)
}

const Wrapper = styled.div`
	align-items: center;
	color: #AAA;
	display: grid;
	grid-template-columns: 16px auto 16px;
	height: 48px;
	margin: 0 .2em;
`

const Prev = styled(Button)`
	font-size: 1.6em;
	margin-top: -4px;
`

const Next = styled(Prev)`
	text-align: right;
`

const PageNumbers = styled.div`
	align-items: center;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(16px, 1fr));
	justify-items: center;
`

function usePages(currentPage: number, pageCount: number) {
	const [first, setFirst] = React.useState([])
	const [current, setCurrent] = React.useState([])
	const [last, setLast] = React.useState([])

	React.useEffect(() => {
		let first: number[] = []
		let current: number[] = []
		let last: number[] = []

		if (pageCount < 7) {
			current = getRange(1, pageCount)
		} else {
			first = [1]
			last = [pageCount]

			if (currentPage < 4) {
				first = getRange(1, 4)
			}
			else if (currentPage > pageCount - 3) {
				last = getRange(pageCount - 3, pageCount)
			}
			else {
				current = getRange(currentPage - 1, currentPage + 1)
			}
		}

		setFirst(first)
		setCurrent(current)
		setLast(last)
	}, [currentPage, pageCount])

	return { first, current, last }
}

interface Props {
	currentPage: number
	resultsPerPage: number
	searchResults: FSResponse
	setCurrentPage: (pageNumber: number) => void
}

function Pagination(props: Props) {
	const pageCount = Math.ceil(props.searchResults.total / props.resultsPerPage)
	if (isNaN(pageCount) || pageCount === 1) return null

	const { first, current, last } = usePages(props.currentPage, pageCount)

	const toPrev = React.useCallback(() => props.setCurrentPage(props.currentPage - 1), [props.currentPage])
	const toNext = React.useCallback(() => props.setCurrentPage(props.currentPage + 1), [props.currentPage])
	const toBetweenFirstAndCurrent = React.useCallback(() => {
		const nextPage = Math.round((first[first.length - 1] + current.concat(last)[0]) / 2)
		props.setCurrentPage(nextPage)
	}, [first, current, last])
	const toBetweenCurrentAndLast = React.useCallback(() => {
		const lowerPageNumbers = first.concat(current) // first can be filled, while current is empty
		const nextPage = Math.round((lowerPageNumbers[lowerPageNumbers.length - 1] + last[0]) / 2)
		props.setCurrentPage(nextPage)
	}, [first, current, last])

	const toPageNumber = React.useCallback(
		(n: number) => (
			<PageNumber
				currentPage={props.currentPage}
				key={n}
				pageNumber={n}
				setCurrentPage={() => props.setCurrentPage(n)}
			/>
		),
		[props.currentPage]
	)

	return (
		<Wrapper className="pagination">
			{props.currentPage !== 1 ?
				<Prev onClick={toPrev}>◂</Prev> :
				<div />
			}
			<PageNumbers className="pagenumbers">
				{first.length > 0 && first.map(toPageNumber)}
				{first.length > 0 && current.length > 0 && <Button onClick={toBetweenFirstAndCurrent}>…</Button>}
				{current.map(toPageNumber)}
				{last.length > 0 && <Button onClick={toBetweenCurrentAndLast}>…</Button>}
				{last.length > 0 && last.map(toPageNumber)}
			</PageNumbers>
			{props.currentPage !== pageCount ?
				<Next onClick={toNext}>▸</Next> :
				<div />
			}
		</Wrapper>
	)
}

export default React.memo(Pagination)
