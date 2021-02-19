# Docere

A flexible and customisable digital (scholarly) edition publishing platform

## Module resolution

Ideally we would like to use ESM only, but especially the support on the NodeJS runtime is experimental. Therefor all the packages which are used on the backend are build with CommonJS modules: @docere/api, @docere/common, @docere/projects, @docere/tests and @docere/xml-file-server. When support matures we could migrate everything to ESM resolution.

## Author

* **Gijsjan Brouwer** ([email](mailto:gijsjan.brouwer@di.huc.knaw.nl))

## License

Docere is licensed under the [**GNU General Public License v3.0**](LICENSE).

