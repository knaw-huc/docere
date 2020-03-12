interface ListFacetConfig extends FacetConfigBase {
	readonly datatype: import('../../../enum').EsDataType.Keyword
	readonly size?: number
}
