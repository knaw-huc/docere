#!/bin/bash

rm -rf dist

# Minified version
../../node_modules/.bin/webpack --config webpack.config.prod.js
