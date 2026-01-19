package ch.zhaw.casproject.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Configuration class for Cross-Origin Resource Sharing (CORS).
 *
 * <p>
 * This configuration allows the backend to accept HTTP requests from a
 * specified frontend origin. The allowed origin is read from the
 * application configuration (application.yml).
 * </p>
 *
 * <p>
 * It enables:
 * <ul>
 *   <li>Requests from the configured frontend URL</li>
 *   <li>All HTTP headers</li>
 *   <li>All HTTP methods (GET, POST, PUT, DELETE, etc.)</li>
 *   <li>Credentials such as cookies or authorization headers</li>
 * </ul>
 * </p>
 */

@Configuration
public class CorsConfig {

    /**
     * URL of the frontend application.
     *
     * <p>
     * This value is injected from the application configuration
     * (e.g. application.yml) using the property key {@code app.frontend-url}.
     * </p>
     */

    @Value("${app.frontend-url}")
    private String frontendUrl;

    /**
     * Creates and configures the {@link CorsConfigurationSource} bean.
     *
     * <p>
     * The configuration allows requests from the configured frontend URL,
     * permits all headers and HTTP methods, and enables credentials.
     * The CORS configuration is applied to all endpoints of the application.
     * </p>
     *
     * @return a configured {@link CorsConfigurationSource} instance
     */

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        // Create a new CORS configuration object
        CorsConfiguration config = new CorsConfiguration();
        // Allow requests only from the configured frontend URL
        config.addAllowedOrigin(frontendUrl);
        // Allow all HTTP headers
        config.addAllowedHeader("*");
        // Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
        config.addAllowedMethod("*");
        // Allow credentials such as cookies or authorization headers
        config.setAllowCredentials(true);
        // Register the CORS configuration for all application endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
