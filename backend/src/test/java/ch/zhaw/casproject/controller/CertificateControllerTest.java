package ch.zhaw.casproject.controller;

import ch.zhaw.casproject.model.Certificate;
import ch.zhaw.casproject.model.Course;
import ch.zhaw.casproject.model.User;
import ch.zhaw.casproject.repository.CertificateRepository;
import ch.zhaw.casproject.repository.UserRepository;
import ch.zhaw.casproject.security.JwtService;
import ch.zhaw.casproject.service.CertificateService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CertificateController.class)
@AutoConfigureMockMvc(addFilters = false)
class CertificateControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CertificateRepository certificateRepository;

    @MockBean
    private CertificateService certificateService;

    @MockBean
    private UserRepository userRepository;

    // ✅ WICHTIG: wird benötigt, weil JwtAuthenticationFilter als Bean geladen wird
    @MockBean
    private JwtService jwtService;

    @Test
    void getCertificatesForUser_ReturnsList() throws Exception {
        UUID userId = UUID.randomUUID();

        when(certificateRepository.findByUserId(userId)).thenReturn(List.of(new Certificate(), new Certificate()));

        mockMvc.perform(get("/api/certificates/user/{userId}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void getMyCertificates_ReturnsList() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = User.builder()
                .id(userId)
                .email("test@example.com")
                .username("testuser")
                .password("pw")
                .build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(certificateRepository.findByUserId(userId)).thenReturn(List.of(new Certificate()));

        mockMvc.perform(get("/api/certificates/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void download_ReturnsPdfWithFilenameHeader() throws Exception {
        User user = User.builder().username("Max Muster").build();

        Course course = new Course();
        course.setName("Java Basics");

        Certificate cert = new Certificate();
        cert.setUser(user);
        cert.setCourse(course);

        when(certificateRepository.findById(1L)).thenReturn(Optional.of(cert));
        when(certificateService.generatePdf(eq("Max Muster"), eq("Java Basics")))
                .thenReturn(new byte[]{1, 2, 3});

        mockMvc.perform(get("/api/certificates/{id}/download", 1L))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"Java_Basics_Max_Muster.pdf\""))
                .andExpect(content().contentType("application/pdf"))
                .andExpect(content().bytes(new byte[]{1, 2, 3}));
    }
}
