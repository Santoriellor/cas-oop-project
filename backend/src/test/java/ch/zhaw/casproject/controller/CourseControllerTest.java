package ch.zhaw.casproject.controller;

import ch.zhaw.casproject.model.Course;
import ch.zhaw.casproject.model.Enrollment;
import ch.zhaw.casproject.model.User;
import ch.zhaw.casproject.repository.CertificateRepository;
import ch.zhaw.casproject.repository.CourseRepository;
import ch.zhaw.casproject.repository.EnrollmentRepository;
import ch.zhaw.casproject.repository.UserRepository;
import ch.zhaw.casproject.security.JwtAuthenticationFilter;
import ch.zhaw.casproject.service.CertificateService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CourseController.class)
@AutoConfigureMockMvc(addFilters = false)
class CourseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    /**
     * Wir mocken den JwtAuthenticationFilter als Bean,
     * damit Spring den echten Filter nicht instanziieren muss
     * (und dadurch kein JwtService benötigt wird).
     */
    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private CourseRepository courseRepository;

    @MockBean
    private EnrollmentRepository enrollmentRepository;

    @MockBean
    private CertificateService certificateService;

    @MockBean
    private CertificateRepository certificateRepository;

    @MockBean
    private UserRepository userRepository;

    @TempDir
    Path tempDir;

    @Test
    void getAllCourses_ReturnsList() throws Exception {
        Course c1 = new Course();
        c1.setId(1L);
        c1.setName("Kurs 1");

        Course c2 = new Course();
        c2.setId(2L);
        c2.setName("Kurs 2");

        when(courseRepository.findAll()).thenReturn(List.of(c1, c2));

        mockMvc.perform(get("/api/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Kurs 1"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createCourse_SuccessWithoutFile() throws Exception {
        Course saved = new Course();
        saved.setId(10L);
        saved.setName("Java");
        saved.setDate(LocalDate.of(2026, 1, 1));
        saved.setStatus("offen");

        when(courseRepository.save(any(Course.class))).thenReturn(saved);

        mockMvc.perform(multipart("/api/courses")
                        .param("name", "Java")
                        .param("date", "2026-01-01")
                        .param("status", "offen"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.name").value("Java"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteCourse_CallsRepository() throws Exception {
        mockMvc.perform(delete("/api/courses/{id}", 5L))
                .andExpect(status().isOk());

        verify(courseRepository, times(1)).deleteById(5L);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateCourse_WhenStatusChangesToBeendet_CreatesCertificates() throws Exception {
        Course existing = new Course();
        existing.setId(1L);
        existing.setName("Java");
        existing.setDate(LocalDate.of(2026, 1, 1));
        existing.setStatus("offen");

        when(courseRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(courseRepository.save(any(Course.class))).thenAnswer(inv -> inv.getArgument(0));

        User u = User.builder()
                .id(UUID.randomUUID())
                .username("testuser")
                .email("u@test.com")
                .password("pw")
                .build();

        Enrollment e = new Enrollment();
        e.setUser(u);
        e.setCourse(existing);

        when(enrollmentRepository.findAll()).thenReturn(List.of(e));
        when(certificateService.generatePdf(eq("testuser"), eq("Java"))).thenReturn(new byte[]{9, 9});

        mockMvc.perform(multipart("/api/courses/{id}", 1L)
                        .with(req -> { req.setMethod("PUT"); return req; })
                        .param("name", "Java")
                        .param("date", "2026-01-01")
                        .param("status", "beendet"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("beendet"));

        verify(certificateRepository, times(1)).save(any());
        verify(certificateService, times(1)).generatePdf(eq("testuser"), eq("Java"));
    }

    @Test
    @WithMockUser(username = "student@example.com")
    void downloadMaterials_Success_WhenEnrolledAndFileExists() throws Exception {
        Path materialFile = tempDir.resolve("script.pdf");
        Files.write(materialFile, "hello".getBytes());

        Course course = new Course();
        course.setId(7L);
        course.setMaterials(materialFile.toString());

        UUID userId = UUID.randomUUID();
        User user = User.builder()
                .id(userId)
                .email("student@example.com")
                .username("student")
                .password("pw")
                .build();

        Enrollment enrollment = new Enrollment();
        enrollment.setCourse(course);
        enrollment.setUser(user);

        when(courseRepository.findById(7L)).thenReturn(Optional.of(course));
        when(userRepository.findByEmail("student@example.com")).thenReturn(Optional.of(user));
        when(enrollmentRepository.findByUserId(userId)).thenReturn(List.of(enrollment));

        mockMvc.perform(get("/api/courses/{id}/materials/download", 7L))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + materialFile.getFileName() + "\""))
                .andExpect(content().contentType("application/octet-stream"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void uploadMaterials_ReturnsOkMessage() throws Exception {
        Course course = new Course();
        course.setId(3L);

        when(courseRepository.findById(3L)).thenReturn(Optional.of(course));
        when(courseRepository.save(any(Course.class))).thenAnswer(inv -> inv.getArgument(0));

        MockMultipartFile file = new MockMultipartFile(
                "file", "unterlagen.txt", "text/plain", "inhalt".getBytes()
        );

        mockMvc.perform(multipart("/api/courses/{id}/materials/upload", 3L).file(file))
                .andExpect(status().isOk())
                .andExpect(content().string("Datei erfolgreich hochgeladen"));

        verify(courseRepository, times(1)).save(any(Course.class));
    }
}
