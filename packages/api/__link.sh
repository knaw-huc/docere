#!/bin/bash

# The ./clean.sh script in the <root> dir will take care of @docere interdependencies, but 
# @docere/api is ignored in the ./clean.sh script, because it needs it's dependencies locally.
# This script adds symlinks to @docere/api dependencies on other @docere packages. The dependencies are
# not really needed for @docere/api itself, but when importing @docere/projects, all deps will be
# resolved and an error will enfold when they are not found

mkdir -p node_modules/@docere
cd node_modules/@docere

rm common text text-components ui-components
ln -s ../../../common common
ln -s ../../../text text
ln -s ../../../text-components text-components
ln -s ../../../ui-components ui-components
