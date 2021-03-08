# Update node_modules
rm -rf node_modules

## First install lerna, otherwise npx uses the latest version instead
## of the version in package.json
npm install lerna

npm run install

# Copy the env vars
cp .env.testing .env

# Build
npm run build

# Dist
rm -rf public/js
npm run dist

npm run start:testing
