package ch.zhaw.casproject.controller;

import ch.zhaw.casproject.model.Role;
import ch.zhaw.casproject.model.User;
import ch.zhaw.casproject.repository.UserRepository;
import ch.zhaw.casproject.security.JwtService;
import ch.zhaw.casproject.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;
import java.util.Set;

import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable filters for simpler controller testing
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private JwtService jwtService; // Needed for JwtAuthenticationFilter if filters weren't disabled

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void register_Success() throws Exception {
        AuthController.RegisterRequest request = new AuthController.RegisterRequest();
        request.setEmail("test@example.com");
        request.setUsername("testuser");
        request.setPassword("password");
        request.setIsUser(true);

        when(authService.register(anyString(), anyString(), anyString(), anyBoolean(), anyBoolean()))
                .thenReturn("mock-token");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-token"));
    }

    @Test
    void login_Success() throws Exception {
        AuthController.LoginRequest request = new AuthController.LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("password");

        when(authService.login(anyString(), anyString()))
                .thenReturn("mock-token");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-token"));
    }

    @Test
    void isEmailAvailable_ReturnsTrue() throws Exception {
        when(userRepository.findByEmail("new@example.com")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/auth/available/email")
                        .param("value", "new@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.available").value(true));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void getCurrentUser_Success() throws Exception {
        User user = User.builder()
                .email("test@example.com")
                .username("testuser")
                .roles(Set.of(Role.ROLE_USER))
                .build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.username").value("testuser"));
    }
}
