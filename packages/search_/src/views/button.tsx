import styled from 'styled-components'

const Button = styled('div')`
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
	align-content: center;
	border-radius: 3px;
	border: 1px solid white;
	display: grid;
	height: 20px;
	justify-content: center;
	transform: translateY(0);
	width: 20px;

	${(props: { active: boolean, spotColor: string }) => props.active ?
		`
			border: 1px solid ${props.spotColor};
		` :
		`&:hover {
			border: 1px solid ${props.spotColor}66;
		}`
	}

`

export const FacetInfoButton = styled(FacetMenuButton)`
`

export default Button
