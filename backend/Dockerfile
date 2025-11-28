FROM eclipse-temurin:25-jdk-jammy
ARG JAR_FILE=target/demo-backend-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
