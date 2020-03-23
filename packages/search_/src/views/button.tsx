import styled from '@emotion/styled'
import { SPOT_COLOR } from '../constants'

const Button = styled('button')`
	background: none;
	border: none;
	color: ${SPOT_COLOR};
	cursor: pointer;
	outline: none;
	padding: 0;
`

export const MoreLessButton = styled(Button)`
	margin-left: 24px;
`

export const FacetMenuButton = styled(Button)`
	width: 24px;
`

export default Button