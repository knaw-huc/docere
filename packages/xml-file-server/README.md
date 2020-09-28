# Docere XML file server
Opionated file server which serves the directory structure per level and XML files only.

## Example output
`$ curl localhost:3003/<some-dir>`
```json
{
	"directories": ["/<some-dir>/subdir1", "/<some-dir>/subdir2"],
	"files": ["/<some-dir>/file1.xml", "/<some-dir>/file2.xml"]
}
```
To get the structure of `/<some-dir>/subdir1` a new request should be send.

## Development
`$ npm run watch`

## Run local instance (for dev or testing)
`$ DOCERE_XML_BASE_PATH=/some/custom/dir npx .`

## Env variable
DOCERE_XML_BASE_PATH defaults to `/data/xml`


