#!/bin/bash

# Dev version
../../node_modules/.bin/webpack

# Minified version
../../node_modules/.bin/webpack --config webpack.config.prod.js

# Emit declaration files
rm -rf ../seach/types
tsc --declaration --emitDeclarationOnly --outDir ../search/types
