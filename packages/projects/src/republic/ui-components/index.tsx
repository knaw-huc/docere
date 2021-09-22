import { UIComponentType } from '@docere/common'
import { EntityComponentProps, EntityWrapper, TextEntity } from '@docere/ui-components'
import { SearchResult } from './search-result'
import { AttendantEntity } from './attendant'
import React from 'react'
import styled from 'styled-components'

const components = new Map()
const entities = new Map()

components.set(UIComponentType.Entity, entities)
components.set(UIComponentType.SearchResult, SearchResult)
components.set(UIComponentType.SearchHome, SearchHome)

entities.set('line', TextEntity)
entities.set('resolution', EmptyEntity)
entities.set('attendance_list', EmptyEntity)
entities.set('_attendant', AttendantEntity)

export default components


function EmptyEntity(props: EntityComponentProps) {
	return (
		<EntityWrapper
			entity={props.entity}
		/>
	)
}

function SearchHome() {
	return (
		<Wrapper>
			<h2>Webeditie Resoluties Staten-Generaal</h2>
			<h3>prototype achttiende eeuw</h3>
			<section>
				<div>Lees meer over:</div>
				<ul>
					<li>
						<a href="https://republic.huygens.knaw.nl/index.php/zoeken-naar-tekst-in-republic/#Zoektermen">Zoektermen</a>
					</li>
					<li>
						<a href="https://republic.huygens.knaw.nl/index.php/zoeken-naar-tekst-in-republic/#Zoekoperatoren">Zoekoperatoren</a>
					</li>
					<li>
						<a href="https://republic.huygens.knaw.nl/index.php/zoeken-naar-tekst-in-republic/#zoekoperatorenCombi">Het combineren van zoekoperatoren</a>
					</li>
					<li>
						<a href="https://republic.huygens.knaw.nl/index.php/zoeken-naar-tekst-in-republic/#Hoofdletters-leestekens">Hoofdletters en leestekens</a>
					</li>
				</ul>
			</section>
			<section className="feedback">
				Deze webeditie is in ontwikkeling. Heeft u een vraag, opmerking of suggestie?<br />
				Stuur deze dan naar: <a href="mailto:Republic_Goetgevonden@huygens.knaw.nl">Republic_Goetgevonden@huygens.knaw.nl</a>
			</section>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	font-family: Roboto, sans-serif;

	h2 {
		font-size: 2rem;
		margin: 0;
	}

	h3 {
		margin: 0;
	}

	section {
		margin: 2rem 0;
	}

	a {
		color: #0088CC;
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}

	.feedback {
		background: #0088CC11;
		font-size: .95rem;
		padding: 1rem;
		border-radius: 4px;
	}
`
