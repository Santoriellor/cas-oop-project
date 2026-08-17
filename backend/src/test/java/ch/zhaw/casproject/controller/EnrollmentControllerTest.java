package ch.zhaw.casproject.controller;

import ch.zhaw.casproject.model.Course;
import ch.zhaw.casproject.model.Enrollment;
import ch.zhaw.casproject.model.User;
import ch.zhaw.casproject.repository.CourseRepository;
import ch.zhaw.casproject.repository.EnrollmentRepository;
import ch.zhaw.casproject.repository.UserRepository;
import ch.zhaw.casproject.security.JwtAuthenticationFilter;
import ch.zhaw.casproject.service.EmailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EnrollmentController.class)
@AutoConfigureMockMvc(addFilters = false)
class EnrollmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    /**
     * JwtAuthenticationFilter mocken,
     * damit Spring ihn nicht instanziert (und damit kein JwtService braucht)
     */
    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private EnrollmentRepository enrollmentRepository;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private CourseRepository courseRepository;

    @MockBean
    private EmailService emailService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getAllEnrollments_ReturnsList() throws Exception {
        when(enrollmentRepository.findAll()).thenReturn(List.of(new Enrollment(), new Enrollment()));

        mockMvc.perform(get("/api/enrollments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void getEnrollmentsForUser_ReturnsList() throws Exception {
        UUID userId = UUID.randomUUID();
        when(enrollmentRepository.findByUserId(userId)).thenReturn(List.of(new Enrollment()));

        mockMvc.perform(get("/api/enrollments/user/{userId}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void getMyEnrollments_ReturnsList() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = User.builder()
                .id(userId)
                .email("test@example.com")
                .username("test")
                .password("pw")
                .build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(enrollmentRepository.findByUserId(userId)).thenReturn(List.of(new Enrollment(), new Enrollment()));

        mockMvc.perform(get("/api/enrollments/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void createEnrollment_Success() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = User.builder()
                .id(userId)
                .email("test@example.com")
                .username("testuser")
                .password("pw")
                .build();

        Course course = new Course();
        course.setId(1L);
        course.setStatus("offen");

        Enrollment saved = new Enrollment();
        saved.setId(99L);
        saved.setUser(user);
        saved.setCourse(course);
        saved.setStatus("angemeldet");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(enrollmentRepository.save(any(Enrollment.class))).thenReturn(saved);

        String body = """
                { "courseId": 1 }
                """;

        mockMvc.perform(post("/api/enrollments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("angemeldet"));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void createEnrollment_WhenCourseIsBeendet_ThrowsServletExceptionWithRuntimeCause() throws Exception {
        User user = User.builder()
                .id(UUID.randomUUID())
                .email("test@example.com")
                .username("test")
                .password("pw")
                .build();

        Course course = new Course();
        course.setId(1L);
        course.setStatus("beendet");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        String body = """
            { "courseId": 1 }
            """;

        ServletException servletEx = Assertions.assertThrows(ServletException.class, () ->
                mockMvc.perform(post("/api/enrollments")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(body))
                        .andReturn()
        );

        // Root cause (die ursprüngliche RuntimeException) finden
        Throwable root = servletEx;
        while (root.getCause() != null) {
            root = root.getCause();
        }

        Assertions.assertTrue(root instanceof RuntimeException);
        Assertions.assertTrue(root.getMessage().contains("Kurs ist beendet"));
    }

}

