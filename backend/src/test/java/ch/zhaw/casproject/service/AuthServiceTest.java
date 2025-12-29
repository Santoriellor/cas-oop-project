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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private JwtService jwtService;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private AuthenticationManager authManager;

    @InjectMocks
    private AuthService authService;

    private String email = "test@example.com";
    private String username = "testuser";
    private String password = "password";

    @Test
    void register_Success() {
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());
        when(passwordEncoder.encode(password)).thenReturn("encodedPassword");
        when(jwtService.generateToken(anyString(), anySet())).thenReturn("mockToken");

        String token = authService.register(email, username, password, true, false);

        assertEquals("mockToken", token);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_DuplicateEmail_ThrowsException() {
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(new User()));

        assertThrows(AuthService.DuplicateEmailException.class, () -> {
            authService.register(email, username, password, true, false);
        });
    }

    @Test
    void register_DuplicateUsername_ThrowsException() {
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(new User()));

        assertThrows(AuthService.DuplicateUsernameException.class, () -> {
            authService.register(email, username, password, true, false);
        });
    }

    @Test
    void register_NoRoleSelected_ThrowsException() {
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        assertThrows(AuthService.NoRoleSelectedException.class, () -> {
            authService.register(email, username, password, false, false);
        });
    }

    @Test
    void login_Success() {
        User user = User.builder()
                .email(email)
                .roles(Set.of(Role.ROLE_USER))
                .build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(jwtService.generateToken(eq(email), anySet())).thenReturn("mockToken");

        String token = authService.login(email, password);

        assertEquals("mockToken", token);
        verify(authManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void login_InvalidCredentials_ThrowsException() {
        doThrow(new RuntimeException("Bad credentials")).when(authManager).authenticate(any(UsernamePasswordAuthenticationToken.class));

        assertThrows(AuthService.InvalidCredentialsException.class, () -> {
            authService.login(email, password);
        });
    }
}
