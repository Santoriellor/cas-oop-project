package ch.zhaw.casproject.service;

import ch.zhaw.casproject.model.Role;
import ch.zhaw.casproject.model.User;
import ch.zhaw.casproject.repository.UserRepository;
import ch.zhaw.casproject.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;

    // --- Custom exceptions ---
    public static class DuplicateEmailException extends RuntimeException {
        public DuplicateEmailException(String message) { super(message); }
    }

    public static class DuplicateUsernameException extends RuntimeException {
        public DuplicateUsernameException(String message) { super(message); }
    }

    public static class InvalidCredentialsException extends RuntimeException {
        public InvalidCredentialsException(String message) { super(message); }
    }

    // --- Registration ---
    public String register(String email, String username, String password) {
        if (userRepository.findByEmail(email).isPresent())
            throw new DuplicateEmailException("Email already registered");

        if (userRepository.findByUsername(username).isPresent())
            throw new DuplicateUsernameException("Username already taken");

        User user = User.builder()
                .email(email)
                .username(username)
                .password(passwordEncoder.encode(password))
                .roles(new HashSet<>(Set.of(Role.ROLE_USER)))
                .build();

        userRepository.save(user);

        // Use email as the JWT subject to align with authentication expecting email
        return jwtService.generateToken(user.getEmail(), user.getRoles());
    }

    // --- Login ---
    public String login(String email, String password) {
        try {
            authManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        } catch (Exception e) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        // update last login timestamp
        user.setLastLogin(OffsetDateTime.now());
        userRepository.save(user);

        // Use email as the JWT subject to align with downstream extraction/lookup by email
        return jwtService.generateToken(user.getEmail(), user.getRoles());
    }
}
