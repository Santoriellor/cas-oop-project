# Stage 1 — Build the Spring Boot app
# Maven is preinstalled in this image. The ./mvnw wrapper cannot run on the
# deployment host: its bootstrap extraction fails with ENOSYS on kernel 5.4.
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY backend/ ./

# Download dependencies first (for caching)
RUN mvn dependency:go-offline -B

# Build the application (skip tests for faster build)
RUN mvn clean package spring-boot:repackage -DskipTests -B

# Stage 2 — Run the JAR
# Runtime needs a JRE, not a JDK. Java 21 matches the build: the build stage is
# maven:3.9-eclipse-temurin-21 and pom.xml sets maven.compiler.release=21.
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Run unprivileged. Port 8080 is above 1024, so no capability is required.
# /app/logs must exist and be writable: application.yml sets
# logging.file.name=logs/app.log, which resolves under this working directory.
RUN groupadd --gid 1000 app \
    && useradd --uid 1000 --gid 1000 --no-create-home --shell /usr/sbin/nologin app \
    && mkdir -p /app/logs \
    && chown -R 1000:1000 /app

USER 1000:1000

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
