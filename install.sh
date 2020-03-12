#!/bin/bash

# Remove all package-lock.json files, because Lerna will error on them
find -type f -name "package-lock.json" -delete

# Remove node_modules
npx lerna clean --yes

# Hoist all deps to the <root>/node_modules
npx lerna bootstrap --hoist
