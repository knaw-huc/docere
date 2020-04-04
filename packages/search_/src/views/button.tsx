import styled from 'styled-components'

const Button = styled('button')`
	background: none;
	border: none;
	color: ${(props: { spotColor: string }) => props.spotColor};
	cursor: pointer;
	outline: none;
	padding: 0;
`

export const MoreLessButton = styled(Button)`
	font-weight: normal;
`

export const FacetMenuButton = styled(Button)`
	width: 24px;
`

export default Button
