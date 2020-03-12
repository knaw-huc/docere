# Docere

Docere is a tool for publishing digital scholarly editions. Docere aims to find the sweet spot between the wishes of researchers (flexibility and customization) and software developers (predictability and maintainability). This feature is achieved by using pure functions which are tailored to a specific project or set of XML documents. The functions are used to prepare the XML documents and extract data like metadata, text data, text layers, facsimiles and annotations. All the functions are run in a browser environment, because the browser is great at reading and manipulating DOM trees. The output of the functions is used to generate a generic digital edition with faceted search, powered by very diverse XML.

Docere is a Latin word that means to instruct, teach, or point out and the origin of the modern word 'document'.

## DEV
Start backend containers and development server
```
$ npm run backend
$ npm run dev
```

## DIRS
- build/ = webpack dev output
- dist/ = webpack prod output
- node_modules/ = dependencies
- src/ = typescript source files
- static/ = static files like fonts, images
