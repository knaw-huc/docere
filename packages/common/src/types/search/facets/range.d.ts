interface RangeFacetConfig extends FacetConfigBase {
	readonly datatype: import('../../../enum').EsDataType.Integer
	readonly interval: number,
}
