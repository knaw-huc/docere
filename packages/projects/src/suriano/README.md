# Suriano

## Convert docx to xml/html 
1) Export .docx in LibreOffice to .epub3
2) Convert to .html using PanDoc
	$ docker run -v /some-host-dir:/docs pandoc/core '/docs/suriano.epub' -f epub -t html -s -o '/docs/suriano.html'


## Convert multiple docx
$ remove `.` (dots) and ` ` (spaces) from file names
$ for f in *.docx; do docker run -v $PWD:/docs pandoc/core "/docs/$f" -f docx -t tei -s -o "/docs/$(basename $f .docx).xml"; done;
$ for f in *.xml; do xmllint -o $f.tmp --format $f; done;
$ for f in *.tmp; do mv $f $(basename $f .tmp); done;
