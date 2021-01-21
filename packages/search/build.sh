#!/bin/bash

rm -rf build

# Dev version
npx webpack

# Emit declaration files
npx tsc --declaration --emitDeclarationOnly --outDir build/types
