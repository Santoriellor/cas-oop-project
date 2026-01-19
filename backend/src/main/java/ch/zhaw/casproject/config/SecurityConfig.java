package ch.zhaw.casproject.config;

import ch.zhaw.casproject.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Main Spring Security configuration for the application.
 *
 * <p>
 * This configuration enables method-level security and sets up a stateless,
 * JWT-based authentication mechanism for API endpoints.
 * </p>
 *
 * <p>
 * The configuration:
 * <ul>
 *   <li>Disables CSRF protection (typical for stateless REST APIs)</li>
 *   <li>Enables CORS support (expects a {@code CorsConfigurationSource} bean elsewhere)</li>
 *   <li>Uses stateless session management</li>
 *   <li>Permits unauthenticated access to authentication, health, and API documentation endpoints</li>
 *   <li>Requires authentication for all remaining endpoints</li>
 *   <li>Installs a custom {@link JwtAuthenticationFilter} into the filter chain</li>
 * </ul>
 * </p>
 */

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    /**
     * JWT authentication filter used to validate and process JWT tokens
     * before the standard Spring Security authentication filter.
     */

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * Creates the {@link org.springframework.security.crypto.password.PasswordEncoder} bean.
     *
     * <p>
     * Uses BCrypt, which is a strong adaptive hashing algorithm recommended
     * for password storage.
     * </p>
     *
     * @return a BCrypt-based password encoder
     */

    @Bean
    public org.springframework.security.crypto.password.PasswordEncoder passwordEncoder() {
        return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
    }

    /**
     * Configures the Spring Security filter chain.
     *
     * <p>
     * This filter chain disables CSRF protection, enables CORS, enforces stateless session handling,
     * defines authorization rules for public vs. protected endpoints, and integrates the custom
     * {@link JwtAuthenticationFilter}.
     * </p>
     *
     * @param http the {@link HttpSecurity} to configure
     * @return the configured {@link SecurityFilterChain}
     * @throws Exception if an error occurs while building the security configuration
     */

  @Bean
  public SecurityFilterChain securityfilterChain(HttpSecurity http) throws Exception {

    http
            // Disable CSRF protection for stateless REST APIs
            .csrf(AbstractHttpConfigurer::disable)
            // Enable CORS support (uses a CorsConfigurationSource bean if provided)
            .cors(cors -> {})
            // Configure stateless session management (no server-side session)
            .sessionManagement(session -> session
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            // Configure authorization rules for HTTP requests
            .authorizeHttpRequests(auth -> auth
                    // Public endpoints: authentication, health checks, error handling, and Swagger/OpenAPI docs
                .requestMatchers(
                            "/api/auth/**",
                            "/api/health",
                            "/api/health/**",
                            "/error",
                            "/v3/api-docs/**",
                            "/swagger-ui/**",
                            "/swagger-ui.html",
                            "/swagger-ui/index.html",
                            "/swagger-ui/index.html/**",
                            "/webjars/**").permitAll()
                // Example of an explicitly protected endpoint (redundant due to anyRequest().authenticated(),
                // but kept for clarity and potential future differentiation)
                .requestMatchers("/api/users/me").authenticated()
                // All other endpoints require authentication
                .anyRequest().authenticated()
            )
            // Add JWT authentication filter before the default username/password filter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

    /**
     * Exposes the {@link AuthenticationManager} as a Spring bean.
     *
     * <p>
     * The {@link AuthenticationManager} is obtained from Spring's
     * {@link AuthenticationConfiguration} and can be used by authentication
     * services/controllers to perform authentication.
     * </p>
     *
     * @param config the {@link AuthenticationConfiguration} provided by Spring Security
     * @return the application's {@link AuthenticationManager}
     * @throws Exception if the authentication manager cannot be created
     */

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
