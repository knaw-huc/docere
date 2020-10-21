# Docere: start a new project

## Bare minimum
- $ cd <docere-root>/packages/projects/src
- $ mdkir -p <new-project-id>/xml <new-project-id>/facsimiles
- $ cp -r <xml-source> <new-project-id>/xml/
- $ cp -r <facsimles-source> <new-project-id>/facsimiles/
- $ cp <other-project-id>/index.ts <new-project-id>
- $ cp <other-project-id>/config.ts <new-project-id>
- $ cp -r <other-project-id>/components <new-project-id>
- Edit `index.ts` and `config.ts`
- Set `private: true` in project config?
- Add <new-project-id> to `projects/src/index.ts`

## Fill the index
- $ docker restart docere_api_1
- $ curl -X POST localhost/api/projects/<new-project-id>/init
- $ curl -X POST localhost/api/projects/<new-project-id>/xml

## Adding facsimiles
- $ cp <other-project-id>/facsimiles.ts <new-project-id>
- Map <new-project-id>/facsimiles to Loris container in docker/docker-compose-(dev|prod).yml
