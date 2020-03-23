import styled from 'styled-components';
import { lb } from '../index'

const getComponents: GetComponents = function(_config) {
	const components: DocereComponents = {
		facsimiles: () => null,
		lb,
		teiHeader: () => null,
		unclear: styled.span`
			color: #888;
			&:before {
				content: '[';
			}
			&:after {
				content: ']';
			}`
	}
	return components
}

export default getComponents
