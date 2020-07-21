import english from './en'

export type LanguageMap = Record<keyof typeof english, string>

const dutch: LanguageMap = {
	active: 'actief',
	clear: "Leegmaken",
	list_facet_filter: "Zoeken in lijst",
	filters: "Filters",
	full_text_query: "Vrije zoekterm",
	highest_first: "Hoogste aantal",
	lowest_first: "Laagste aantal",
	of: "van",
	list_facet_order: "Volgorde",
	range_from: "Van",
	range_to: "Tot",
	remove_filter: "Verwijder filter",
	result: "resultaat",
	results: "resultaten",
	search_documents: "vrij zoeken",
	set_range: "Zoek in periode",
	sort_by: 'sorteren',
	view_more: 'Toon meer',
	view_less: 'Toon minder',
}

export default dutch
