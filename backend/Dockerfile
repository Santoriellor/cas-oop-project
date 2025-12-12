# Stage 1 — Build the Spring Boot app
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

# Copy Maven wrapper and .mvn folder
COPY backend/ ./

# Make mvnw executable
RUN chmod +x mvnw

# Download dependencies first (for caching)
RUN ./mvnw dependency:go-offline -B

# Build the application (skip tests for faster build)
RUN ./mvnw clean package spring-boot:repackage -DskipTests -B

# Stage 2 — Run the JAR
FROM eclipse-temurin:25-jdk
WORKDIR /app

COPY --from=build /app/target/demo-backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
