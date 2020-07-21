#!/bin/bash

rm -rf build
../../node_modules/.bin/tsc

rm -rf build.puppenv.utils
../../node_modules/.bin/webpack
