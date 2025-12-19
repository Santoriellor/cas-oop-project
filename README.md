# CAS project Webapp (Spring Boot + Angular + PostgreSQL)

Architecture:
- docker-compose.yml : deploy PostgreSQL
- /backend : Spring Boot application (REST API + JWT auth)
- /frontend : Angular app (Login / Register / Welcome)

Frontend styling:
- Tailwind CSS integrated for styling pages.
- To develop UI: run `npm install` then `npm start` in `/frontend`.
- Tailwind config: `frontend/tailwind.config.js`; utilities imported in `frontend/src/styles.scss`.

The app is deployed on a VPS with Docker and served through Traefik: https://casproject.santoriello.ch

Each push to the `main` branch triggers a new build and deployment via GitHub Actions.

Configuration:
- Postgres: user=demo_user, pass=demo_pass, db=demo_db
- Spring Boot: application.yml

To run the locally:
- `docker compose -f docker-compose.dev.yml up --build`
