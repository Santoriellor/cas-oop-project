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

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            String token = authService.register(request.getEmail(), request.getUsername(), request.getPassword());
            return ResponseEntity.ok(new TokenResponse(token));
        } catch (AuthService.DuplicateEmailException | AuthService.DuplicateUsernameException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/auth/available/email")
    public ResponseEntity<?> isEmailAvailable(@RequestParam("value") String email) {
        boolean available = userRepository.findByEmail(email).isEmpty();
        return ResponseEntity.ok(Map.of("available", available));
    }

    @GetMapping("/auth/available/username")
    public ResponseEntity<?> isUsernameAvailable(@RequestParam("value") String username) {
        boolean available = !userRepository.existsByUsername(username);
        return ResponseEntity.ok(Map.of("available", available));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            String token = authService.login(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(new TokenResponse(token));
        } catch (AuthService.InvalidCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/users/me")
    public ResponseEntity<UserProfileDto> getCurrentUser(@AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(UserProfileDto.from(user));
    }

    @Data
    public static class RegisterRequest {
        private String email;
        private String username;
        private String password;
    }

    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    @AllArgsConstructor
    static class TokenResponse {
        private String token;
    }
}
