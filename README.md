# Demo Webapp (Spring Boot + Angular + PostgreSQL)

Architecture:
- docker-compose.yml : deploy PostgreSQL
- /backend : Spring Boot application (REST API + JWT auth)
- /frontend : Angular app (Login / Register / Welcome)

Frontend styling:
- Tailwind CSS integrated for styling pages.
- To develop UI: run `npm install` then `npm start` in `/frontend`.
- Tailwind config: `frontend/tailwind.config.js`; utilities imported in `frontend/src/styles.scss`.

Start database :
1. docker-compose up -d

Start backend (from /backend) :
1. mvn clean install
2. mvn spring-boot:run

Start frontend (from /frontend) :
1. npm install
2. npm start

Configuration:
- Postgres: user=demo_user, pass=demo_pass, db=demo_db
- Spring Boot: application.yml
