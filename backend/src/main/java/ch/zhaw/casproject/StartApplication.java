package ch.zhaw.casproject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Spring Boot application.
 *
 * <p>
 * This class bootstraps the application by triggering Spring Boot's
 * auto-configuration, component scanning, and application context startup.
 * </p>
 */

@SpringBootApplication
public class StartApplication {

    /**
     * Application entry point.
     *
     * <p>
     * Launches the Spring Boot application using the provided command-line arguments.
     * </p>
     *
     * @param args command-line arguments passed to the application
     */

  public static void main(String[] args) {
    SpringApplication.run(StartApplication.class, args);
  }
}
