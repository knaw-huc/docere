import styled from 'styled-components'

export const Button = styled('button')`
	background: none;
	border-radius: .2rem;
	border: 1px solid ${(props: { spotColor: string }) => `${props.spotColor}44`};
	color: ${(props: { spotColor: string }) => props.spotColor};
	cursor: pointer;
	font-size: 0.8rem;
	outline: none;
	padding: 0.1rem 0.3rem;

	&:hover {
		background-color: ${(props: { spotColor: string }) => `${props.spotColor}11`};
		border-color: ${(props: { spotColor: string }) => props.spotColor};
	}
`

export const MoreLessButton = styled(Button)`
	display: inline-block;
	font-size: .8rem;
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
