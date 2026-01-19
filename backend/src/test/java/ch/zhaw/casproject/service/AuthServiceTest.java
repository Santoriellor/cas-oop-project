package ch.zhaw.casproject.service;

import ch.zhaw.casproject.model.Role;
import ch.zhaw.casproject.model.User;
import ch.zhaw.casproject.repository.UserRepository;
import ch.zhaw.casproject.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authManager;

    @InjectMocks
    private AuthService authService;

    private JwtService jwtService = new JwtService() {
        @Override
        public String generateToken(String email, Set<Role> roles) {
            return "token";
        }
    };

    private final String email = "test@example.com";
    private final String username = "testuser";
    private final String password = "password";

    @Test
    void register_Success() {
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());
        when(passwordEncoder.encode(password)).thenReturn("encoded");

        authService = new AuthService(userRepository, jwtService, passwordEncoder, authManager);

        String token = authService.register(email, username, password, true, false);

        assertEquals("token", token);
    }

    @Test
    void login_Success() {
        User user = User.builder()
                .email(email)
                .roles(Set.of(Role.ROLE_USER))
                .build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        authService = new AuthService(userRepository, jwtService, passwordEncoder, authManager);

        String token = authService.login(email, password);

        assertEquals("token", token);
    }
}

