#!/bin/bash

rm -rf build

# Dev version
../../node_modules/.bin/webpack

# Emit declaration files
npx tsc --declaration --emitDeclarationOnly --outDir build/types
