package ch.zhaw.casproject.config;

import ch.zhaw.casproject.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Security configuration for the development environment.
 *
 * <p>
 * This configuration is only active when the {@code dev} Spring profile is enabled.
 * It configures stateless JWT-based authentication, enables method-level security,
 * and applies relaxed CORS settings for local development.
 * </p>
 *
 * <p>
 * The configuration:
 * <ul>
 *   <li>Disables CSRF protection (not required for stateless APIs)</li>
 *   <li>Enables CORS using a {@link CorsConfigurationSource} bean</li>
 *   <li>Uses stateless session management</li>
 *   <li>Allows unauthenticated access to authentication and health endpoints</li>
 *   <li>Secures all other endpoints using JWT authentication</li>
 * </ul>
 * </p>
 */

@Configuration
@EnableMethodSecurity
@Profile("dev") // <--- only active when SPRING_PROFILES_ACTIVE=dev
@RequiredArgsConstructor
public class DevSecurityConfig {

    /**
     * JWT authentication filter used to validate and process JWT tokens
     * before the standard Spring Security authentication filter.
     */

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * Configures the Spring Security filter chain for the development profile.
     *
     * <p>
     * The filter chain disables CSRF protection, enables CORS support,
     * enforces stateless session handling, and integrates a custom
     * {@link JwtAuthenticationFilter} for JWT-based authentication.
     * </p>
     *
     * @param http the {@link HttpSecurity} to configure
     * @return the configured {@link SecurityFilterChain}
     * @throws Exception if an error occurs while building the security configuration
     */

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF protection for stateless REST APIs
                .csrf(AbstractHttpConfigurer::disable)
                // Enable CORS support using the CorsConfigurationSource bean
                .cors(cors -> {})
                // Configure stateless session management
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // Configure authorization rules for HTTP requests
                .authorizeHttpRequests(auth -> auth
                        // Public authentication and error endpoints
                        .requestMatchers("/api/auth/**", "/error").permitAll()
                        // Public health check endpoints
                        .requestMatchers("/api/health", "/api/health/**", "/error").permitAll()
                        // All other endpoints require authentication
                        .anyRequest().authenticated()
                )
                // Add JWT authentication filter before the default username/password filter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Creates and configures the {@link CorsConfigurationSource} for development.
     *
     * <p>
     * This configuration allows requests from a local frontend running on
     * {@code http://localhost:4200}, permits all headers and HTTP methods,
     * and enables credentials.
     * </p>
     *
     * <p>
     * The CORS configuration is applied to all application endpoints.
     * </p>
     *
     * @return a configured {@link CorsConfigurationSource} instance
     */

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        // Create a new CORS configuration object
        CorsConfiguration config = new CorsConfiguration();
        // Allow requests from the local development frontend
        config.addAllowedOrigin("http://localhost:4200");
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

