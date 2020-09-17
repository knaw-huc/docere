# Suriano

## Convert docx to xml/html 
1) Export .docx in LibreOffice to .epub3
2) Convert to .html using PanDoc
	$ docker run -v /some-host-dir:/docs pandoc/core '/docs/suriano.epub' -f epub -t html -s -o '/docs/suriano.html'
