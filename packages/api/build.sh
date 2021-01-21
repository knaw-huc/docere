#!/bin/bash

rm -rf build
../../node_modules/.bin/tsc

rm -rf build.puppenv.utils
DOCERE_DTAP=Development ../../node_modules/.bin/webpack
