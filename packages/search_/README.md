# HuC Faceted Search

A rewrite of the [HiRe Faceted Search](https://github.com/huygensing/hire-faceted-search), inspired by [SearchKit](http://searchkit.co)

## Dev

- `npm run watch`

## Dev on examples

- `npm run watch:dev`
- `npm run start:dev`
- Open browser on http://localhost:3333

## Build & dist
The `build` dir has the transpiled TypeScript
The `dist` dir has the bundled (normal & minimized) scripts

- `npm run build`
- `npm run dist`

## Syntax
```typescript
import React from 'react'
import FacetedSearch, { FullTextSearch, Reset, Facets, RangeFacet, ListFacet } from 'huc-faceted-search'

export default function() {
  return (
    <FacetedSearch
      backend="elasticsearch"
      onChange={(request, response) => {}}
      url="/api/search"
    >
      <FullTextSearch />
      <Reset />
      <Facets>
        <RangeFacet
          field="price"
          title="Price range"
          type="number"
        />
        <RangeFacet
          field="date"
          title="Date range"
          type="timestamp"
        />
        <ListFacet
          field="car"
          title="Cars"
        />
      </Facets>
    </FacetedSearch>
  )
}
```

## TODO
- Use <a> for search result
