import * as React from 'react'
import FacetValueView from '../list-facet/value'
import styled from '@emotion/styled'

const List = styled('ul')`
	margin: 0;
	padding: 0;
`

export interface Props {
	// facet: BooleanFacet
	field: string
	filters: Filters
	labels: { true: string, false: string }
	values: BooleanFacetValues
}
export default class BooleanFacetValuesView extends React.PureComponent<Props> {
	render() {
		if (this.props.field == null || this.props.values == null) return null

		const { true: trueCount, false: falseCount } = this.props.values

		return (
			<div>
				<List>
					{
						trueCount > 0 &&
						<FacetValueView
							addFilter={() => this.props.addFilter(this.props.field, 'true')}
							active={this.props.filters.has('true')}
							key={'true'}
							keyFormatter={() => this.props.labels.true}
							removeFilter={() => this.props.removeFilter(this.props.field, 'true')}
							value={{ key: 'true', count: trueCount }}
						/>
					}
					{
						falseCount > 0 &&
						<FacetValueView
							addFilter={() => this.props.addFilter(this.props.field, 'false')}
							active={this.props.filters.has('false')}
							key={'false'}
							keyFormatter={() => this.props.labels.false}
							removeFilter={() => this.props.removeFilter(this.props.field, 'false')}
							value={{ key: 'false', count: falseCount }}
						/>
					}
				</List>
			</div>
		)
	}
}
