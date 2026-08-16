# CAS project Webapp (Spring Boot + Angular + PostgreSQL)

Architecture:
- database : PostgreSQL through Docker
- /backend : Spring Boot application (REST API + JWT auth)
- /frontend : Angular application (UI)

Frontend styling:
- Tailwind CSS integrated for styling pages.
- Tailwind config: `frontend/tailwind.config.js`; utilities imported in `frontend/src/styles.scss`.

Configuration:
- Spring Boot: application.yml
- Angular: angular.json

The app is deployed on a VPS with Docker and served through Traefik: https://casproject.santoriello.ch
Each push to the `main` branch to https://github.com/Santoriellor/cas-oop-project/ repository triggers a new build and deployment via GitHub Actions.

To run the app locally (development), Docker must be installed:
- the first time `docker compose -f docker-compose.dev.yml up --build -d`
  (the backend might take a while to build the image and be ready)
- once built `docker compose -f docker-compose.dev.yml up -d`

To run the backend tests:
- `docker compose -f docker-compose.dev.yml run --rm backend mvn test`

To run the frontend tests:
- `docker compose -f docker-compose.dev.yml run --rm frontend npm test -- --watch=false --browsers=ChromeHeadlessNoSandbox`

## Configuration

No credentials are stored in this repository.

**Local development:** copy `.env.example` to `.env` and fill in your own values.
`.env` is gitignored.

**Production:** secrets live on the deployment host at `/srv/secrets/casproject/`
(`db.env`, `jwt.env`, `mail.env`), outside the deploy directory so the deployment
rsync cannot overwrite them. `docker-compose.yml` injects them with `env_file`.

The JWT signing key is supplied as `JWT_SECRET` and validated at startup — the
application refuses to boot if it is absent, unchanged from a known-bad value, or
shorter than 32 bytes.