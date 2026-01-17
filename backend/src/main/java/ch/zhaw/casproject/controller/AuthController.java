package ch.zhaw.casproject.controller;

import ch.zhaw.casproject.dto.UserProfileDto;
import ch.zhaw.casproject.model.User;
import ch.zhaw.casproject.repository.UserRepository;
import ch.zhaw.casproject.service.AuthService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller responsible for authentication and user-related endpoints.
 *
 * <p>
 * This controller provides endpoints for user registration, login,
 * availability checks for email and username, and retrieval of the
 * currently authenticated user's profile.
 * </p>
 *
 * <p>
 * Authentication is handled using JWT tokens issued by the {@link AuthService}.
 * </p>
 */

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    /**
     * Service handling authentication and registration logic.
     */

    private final AuthService authService;

    /**
     * Repository used for user lookup and availability checks.
     */

    private final UserRepository userRepository;

    /**
     * Registers a new user and returns a JWT token upon successful registration.
     *
     * <p>
     * The registration request includes optional role flags. If no role
     * is selected or if the email/username already exists, the request
     * is rejected.
     * </p>
     *
     * @param request the registration request containing user credentials and role flags
     * @return a JWT token on success, or an error response on failure
     */

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // Delegate registration to the AuthService and return the issued JWT token
            String token = authService.register(request.getEmail(), request.getUsername(), request.getPassword(), 
                    request.getIsUser() != null && request.getIsUser(), 
                    request.getIsAdmin() != null && request.getIsAdmin());
            return ResponseEntity.ok(new TokenResponse(token));
        } catch (AuthService.DuplicateEmailException | AuthService.DuplicateUsernameException | AuthService.NoRoleSelectedException e) {
            // Return validation and business rule errors as a 400 Bad Request
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Checks whether the given email address is available for registration.
     *
     * @param email the email address to check (query parameter {@code value})
     * @return a JSON response containing {@code available=true|false}
     */

    @GetMapping("/auth/available/email")
    public ResponseEntity<?> isEmailAvailable(@RequestParam("value") String email) {
        // Email is available if no user exists with the given email
        boolean available = userRepository.findByEmail(email).isEmpty();
        return ResponseEntity.ok(Map.of("available", available));
    }

    /**
     * Checks whether the given username is available for registration.
     *
     * @param username the username to check (query parameter {@code value})
     * @return a JSON response containing {@code available=true|false}
     */

    @GetMapping("/auth/available/username")
    public ResponseEntity<?> isUsernameAvailable(@RequestParam("value") String username) {
        // Username is available if it does not already exist
        boolean available = !userRepository.existsByUsername(username);
        return ResponseEntity.ok(Map.of("available", available));
    }

    /**
     * Authenticates a user and returns a JWT token upon successful login.
     *
     * @param request the login request containing email and password
     * @return a JWT token on success, or a 401 error response on invalid credentials
     */

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Authenticate user credentials and return the issued JWT token
            String token = authService.login(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(new TokenResponse(token));
        } catch (AuthService.InvalidCredentialsException e) {
            // Invalid credentials result in a 401 Unauthorized response
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Returns the profile of the currently authenticated user.
     *
     * <p>
     * The authenticated principal is injected by Spring Security.
     * If no principal is present, the request is considered unauthenticated.
     * </p>
     *
     * @param principal the authenticated user details
     * @return the current user's profile or {@code 401 Unauthorized} if not authenticated
     */

    @GetMapping("/users/me")
    public ResponseEntity<UserProfileDto> getCurrentUser(@AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails principal) {
        if (principal == null) {
            // No authenticated principal found
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Load the user entity based on the principal's username (email)
        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(UserProfileDto.from(user));
    }

    /**
     * Request DTO for user registration.
     */

    @Data
    public static class RegisterRequest {
        private String email;
        private String username;
        private String password;
        private Boolean isUser;
        private Boolean isAdmin;
    }

    /**
     * Request DTO for user login.
     */

    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    /**
     * Response DTO containing a JWT token.
     */

    @Data
    @AllArgsConstructor
    static class TokenResponse {
        private String token;
    }
}
