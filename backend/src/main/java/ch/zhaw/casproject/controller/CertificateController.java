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

/**
 * REST controller responsible for certificate-related endpoints.
 *
 * <p>
 * This controller provides endpoints for retrieving certificates associated
 * with users and for downloading certificates as PDF documents.
 * </p>
 *
 * <p>
 * Certificate data is retrieved from the persistence layer, while PDF
 * generation is delegated to the {@link CertificateService}.
 * </p>
 */

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    /**
     * Repository used to access certificate data from the database.
     */

    private final CertificateRepository certificateRepository;

    /**
     * Service responsible for generating certificate PDF documents.
     */

    private final CertificateService certificateService;

    /**
     * Repository used to resolve user information from authentication details.
     */

    private final UserRepository userRepository;

    /**
     * Creates a new {@link CertificateController} instance.
     *
     * @param certificateRepository repository for certificate persistence operations
     * @param certificateService service for certificate-related business logic
     * @param userRepository repository for user lookup operations
     */

    public CertificateController(CertificateRepository certificateRepository,
                                 CertificateService certificateService,
                                 UserRepository userRepository) {
        this.certificateRepository = certificateRepository;
        this.certificateService = certificateService;
        this.userRepository = userRepository;
    }

    /**
     * Returns all certificates for a specific user.
     *
     * @param userId the unique identifier of the user
     * @return a list of certificates belonging to the specified user
     */

    @GetMapping("/user/{userId}")
    public List<Certificate> getCertificatesForUser(@PathVariable("userId") UUID userId) {
        return certificateRepository.findByUserId(userId);
    }

    /**
     * Returns all certificates of the currently authenticated user.
     *
     * <p>
     * The authenticated user's identity is obtained from the
     * {@link AuthenticationPrincipal}.
     * </p>
     *
     * @param userDetails the authenticated user's details
     * @return a list of certificates belonging to the current user
     */

    @GetMapping("/me")
    public List<Certificate> getMyCertificates(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return certificateRepository.findByUserId(user.getId());
    }

    /**
     * Downloads a certificate as a PDF file.
     *
     * <p>
     * The certificate is generated dynamically in memory and returned
     * as a downloadable PDF file with a meaningful filename.
     * </p>
     *
     * @param id the unique identifier of the certificate
     * @return a {@link ResponseEntity} containing the generated PDF as a byte array
     */

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> download(@PathVariable("id") Long id) {
        Certificate cert = certificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));

        // Generate the PDF in memory
        byte[] pdfBytes = certificateService.generatePdf(cert.getUser().getUsername(), cert.getCourse().getName());

        // Build a dynamic and readable filename
        String filename = cert.getCourse().getName().replaceAll("\\s+", "_")
                + "_" + cert.getUser().getUsername().replaceAll("\\s+", "_")
                + ".pdf";

        return ResponseEntity.ok()
                // Instruct the browser to download the file instead of displaying it inline
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
