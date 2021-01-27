# Update node_modules
rm -rf node_modules
npm run install

# Copy the env vars
cp .env.testing .env

# Build
npm run build

# Dist
rm -rf public/js
npm run dist

npm run start:testing
