# Demo Webapp (Spring Boot + Angular + PostgreSQL)

Architecture:
- docker-compose.yml : déploie PostgreSQL
- /backend : Spring Boot application (REST API + JWT auth)
- /frontend : Angular app (Login / Register / Welcome)

Frontend styling:
- Tailwind CSS integrated for styling Login and Register pages.
- To develop UI: run `npm install` then `npm start` in `/frontend`.
- Tailwind config: `frontend/tailwind.config.js`; utilities imported in `frontend/src/styles.scss`.

Démarrage de la base de données :
1. docker-compose up -d

Démarrage du backend (depuis /backend) :
1. mvn clean package
2. java -jar target/demo-backend-0.0.1-SNAPSHOT.jar

Démarrage du frontend (depuis /frontend) :
1. npm install
2. npm start

Configuration:
- Postgres: user=demo_user, pass=demo_pass, db=demo_db
- Spring Boot: application.yml configure la connexion. Changez les secrets en production.
