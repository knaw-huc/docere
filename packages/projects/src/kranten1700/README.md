# Historische kranten 1700

$ XML_FILES_PATH=$BASE/docere-projects/src/kranten1700/xml/

## Copy kranten1700 XML between 85k and 90k
$ cd $DIR_WITH_ORIGINALS
$ find -type f -size +85k -size -90k -name "*.xml" -exec cp {} $XML_FILES_PATH \;

## Rename original files
Example original file: historischekranten_45675_28890_3163.tok.frogmodernized.folia.xml
Example renamed file: 45675_28890_3163.xml

$ cd $XML_FILES_PATH
$ node
> const files = fs.readdirSync('.')
> for (const file of files) fs.renameSync(file, file.split(/\.|_/).slice(1,4).join('_').concat('.xml'))
