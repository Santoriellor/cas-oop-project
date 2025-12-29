package ch.zhaw.casproject.controller;

import ch.zhaw.casproject.model.Certificate;
import ch.zhaw.casproject.model.User;
import ch.zhaw.casproject.repository.CertificateRepository;
import ch.zhaw.casproject.repository.UserRepository;
import ch.zhaw.casproject.service.CertificateService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    private final CertificateRepository certificateRepository;
    private final CertificateService certificateService;
    private final UserRepository userRepository;

    public CertificateController(CertificateRepository certificateRepository,
                                 CertificateService certificateService,
                                 UserRepository userRepository) {
        this.certificateRepository = certificateRepository;
        this.certificateService = certificateService;
        this.userRepository = userRepository;
    }

    // Liste aller Zertifikate für einen User
    @GetMapping("/user/{userId}")
    public List<Certificate> getCertificatesForUser(@PathVariable("userId") UUID userId) {
        return certificateRepository.findByUserId(userId);
    }

    @GetMapping("/me")
    public List<Certificate> getMyCertificates(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return certificateRepository.findByUserId(user.getId());
    }

    // PDF herunterladen
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> download(@PathVariable("id") Long id) {
        Certificate cert = certificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));

        // PDF im Speicher erzeugen
        byte[] pdfBytes = certificateService.generatePdf(cert.getUser().getUsername(), cert.getCourse().getName());

        // Dynamischer Dateiname
        String filename = cert.getCourse().getName().replaceAll("\\s+", "_")
                + "_" + cert.getUser().getUsername().replaceAll("\\s+", "_")
                + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
