/// <reference path="./boolean.d.ts" />
/// <reference path="./date.d.ts" />
/// <reference path="./list.d.ts" />
/// <reference path="./hierarchy.d.ts" />
/// <reference path="./range.d.ts" />

/*
 * FacetConfigBase is defined in @docere/common because it is also the
 * base for metadata and entities config
*/
interface FacetConfigBase extends BaseConfig {
	readonly datatype?: import('../../../enum').EsDataType
	readonly order?: number
}

interface OtherFacetConfig extends FacetConfigBase {
	readonly datatype?: import('../../../enum').EsDataType.Geo_point | import('../../../enum').EsDataType.Null | import('../../../enum').EsDataType.Text
}

type FacetConfig = BooleanFacetConfig | DateFacetConfig | HierarchyFacetConfig | ListFacetConfig | RangeFacetConfig | OtherFacetConfig
