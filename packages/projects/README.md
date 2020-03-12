# Docere Projects

## Update server
```
$ rsync -vaPzz --exclude="node_modules" --exclude="achterdeschermen" --exclude="facsimiles" --exclude="gheys/xml" docere-projects gijsjanb@docere:~
```

## Build & bundle

There are two output dirs.
- `build`: tsc output with ESNext module resolution
	- imported in `docere` and `import()` used by Webpack to signal a code splitting point
	- imported in `docere-api` with the use of the `esm` package
- `bundle`: webpack output
	- used by `docere-api` (NodeJS) in the Puppeteer env

## TODO

- remove chunks from bundle
