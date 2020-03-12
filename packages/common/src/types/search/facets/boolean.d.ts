interface BooleanFacetConfig extends FacetConfigBase {
	readonly datatype: import('../../../enum').EsDataType.Boolean
	readonly labels?: { false: string, true: string }
}
