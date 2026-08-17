package ch.zhaw.casproject.controller;

import ch.zhaw.casproject.model.Certificate;
import ch.zhaw.casproject.model.Course;
import ch.zhaw.casproject.model.Enrollment;
import ch.zhaw.casproject.repository.CertificateRepository;
import ch.zhaw.casproject.repository.CourseRepository;
import ch.zhaw.casproject.repository.EnrollmentRepository;
import ch.zhaw.casproject.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import ch.zhaw.casproject.model.User;
import ch.zhaw.casproject.repository.UserRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;

/**
 * REST controller responsible for course management and related operations.
 *
 * <p>
 * This controller provides endpoints for:
 * <ul>
 *   <li>Listing all available courses</li>
 *   <li>Creating, updating, and deleting courses (ADMIN only)</li>
 *   <li>Uploading and downloading course materials</li>
 *   <li>Generating certificates when a course is completed</li>
 * </ul>
 * </p>
 *
 * <p>
 * Access to administrative operations is restricted using role-based
 * authorization via {@link PreAuthorize}.
 * </p>
 */

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    /**
     * Repository for accessing and persisting {@link Course} entities.
     */

    @Autowired
    private CourseRepository courseRepository;

    /**
     * Repository for accessing {@link Enrollment} data.
     */

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    /**
     * Service responsible for generating certificate PDFs.
     */

    @Autowired
    private CertificateService certificateService;

    /**
     * Repository for accessing and persisting {@link Certificate} entities.
     */

    @Autowired
    private CertificateRepository certificateRepository;

    /**
     * Repository for accessing {@link User} data.
     */

    @Autowired
    private UserRepository userRepository;

    /**
     * Filesystem directory where uploaded course materials are stored.
     */

    @Value("${app.upload-dir:/app/uploads}")
    private String uploadDir;

    /**
     * Returns a list of all courses.
     *
     * @return all available {@link Course} entities
     */

    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    /**
     * Creates a new course (ADMIN only).
     *
     * <p>
     * Supports optional upload of course materials using multipart form data.
     * Uploaded files are stored on the server filesystem and the file path
     * is saved with the course.
     * </p>
     *
     * @param name the course name
     * @param date the course date (ISO format)
     * @param status the course status
     * @param file optional course materials file
     * @return the persisted {@link Course}
     * @throws Exception if file handling or persistence fails
     */

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Course createCourse(
            @RequestParam("name") String name,
            @RequestParam("date") String date,
            @RequestParam("status") String status,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) throws Exception {

        // Create and populate a new course entity
        Course course = new Course();
        course.setName(name);
        course.setDate(LocalDate.parse(date));
        course.setStatus(status);

        // Handle optional materials upload
        if (file != null && !file.isEmpty()) {
            Path uploadDirPath = Paths.get(this.uploadDir);
            Files.createDirectories(uploadDirPath);

            Path filePath = uploadDirPath.resolve(file.getOriginalFilename());
            Files.write(filePath, file.getBytes());

            course.setMaterials(filePath.toString());
        }

        return courseRepository.save(course);
    }

    /**
     * Deletes a course by its ID (ADMIN only).
     *
     * @param id the course ID
     */

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable("id") Long id) {
        courseRepository.deleteById(id);
    }

    /**
     * Updates a course and optionally its materials (ADMIN only).
     *
     * <p>
     * If the course status changes to {@code "beendet"} (completed),
     * certificates are generated for all enrolled users.
     * Certificates are generated only once when the status transitions
     * to completed.
     * </p>
     *
     * @param id the course ID
     * @param name the updated course name
     * @param date the updated course date (ISO format)
     * @param status the updated course status
     * @param file optional updated materials file
     * @return the updated {@link Course}
     * @throws Exception if file handling or persistence fails
     */

    /** gelöscht am 28.12.25
    @PutMapping("/{id}")
    public Course updateCourse(@PathVariable Long id, @RequestBody Course updatedCourse) {
        return courseRepository.findById(id).map(course -> {
            course.setName(updatedCourse.getName());
            course.setDate(updatedCourse.getDate());
            course.setStatus(updatedCourse.getStatus());
            course.setMaterials(updatedCourse.getMaterials());

            Course savedCourse = courseRepository.save(course);

            // ⭐ PDF-Zertifikate erzeugen, wenn Status auf "beendet" gesetzt
            if ("beendet".equalsIgnoreCase(updatedCourse.getStatus())) {
                List<Enrollment> enrollments = enrollmentRepository.findAll().stream()
                        .filter(e -> e.getCourse().getId().equals(id))
                        .toList();

                for (Enrollment e : enrollments) {
                    byte[] pdf = certificateService.generatePdf(e.getUser().getUsername(), course.getName());

                    Certificate cert = new Certificate();
                    cert.setCourse(course);
                    cert.setUser(e.getUser());
                    cert.setFilePath(null); // optional
                    certificateRepository.save(cert);
                }
            }

            return savedCourse;
        }).orElseThrow(() -> new RuntimeException("Course not found"));
    }
     */

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Course updateCourse(
            @PathVariable("id") Long id,
            @RequestParam("name") String name,
            @RequestParam("date") String date,
            @RequestParam("status") String status,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) throws Exception {

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kurs nicht gefunden"));

        // Store the previous status to detect status transitions
        String previousStatus = course.getStatus();

        // Apply updated values
        course.setName(name);
        course.setDate(LocalDate.parse(date));
        course.setStatus(status);

        // Upload updated materials if provided
        if (file != null && !file.isEmpty()) {
            Path uploadDirPath = Paths.get(this.uploadDir);
            Files.createDirectories(uploadDirPath);

            Path filePath = uploadDirPath.resolve(file.getOriginalFilename());
            Files.write(filePath, file.getBytes());

            course.setMaterials(filePath.toString());
        }

        Course savedCourse = courseRepository.save(course);

        // Generate certificates only if status has changed to "beendet"
        if (!"beendet".equalsIgnoreCase(previousStatus) && "beendet".equalsIgnoreCase(status)) {
            List<Enrollment> enrollments = enrollmentRepository.findAll().stream()
                    .filter(e -> e.getCourse().getId().equals(id))
                    .toList();

            for (Enrollment e : enrollments) {
                // Generate certificate PDF
                byte[] pdf = certificateService.generatePdf(e.getUser().getUsername(), course.getName());

                // Persist certificate metadata
                Certificate cert = new Certificate();
                cert.setCourse(course);
                cert.setUser(e.getUser());
                cert.setFilePath(null); // optional: store path or byte[] later
                certificateRepository.save(cert);
            }
        }


        return savedCourse;
    }

    /**
     * Downloads course materials for an enrolled user.
     *
     * <p>
     * Access is restricted to users who are enrolled in the course.
     * </p>
     *
     * @param id the course ID
     * @param userDetails the authenticated user
     * @return the course materials as a downloadable resource
     */

    @GetMapping("/{id}/materials/download")
    public ResponseEntity<Resource> downloadMaterials(@PathVariable("id") Long id,
                                                      @AuthenticationPrincipal UserDetails userDetails) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kurs nicht gefunden"));

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User nicht gefunden"));

        // Verify that the user is enrolled in the course
        boolean enrolled = enrollmentRepository.findByUserId(user.getId()).stream()
                .anyMatch(e -> e.getCourse().getId().equals(id));

        if (!enrolled) {
            throw new RuntimeException("Nicht angemeldet für diesen Kurs");
        }

        if (course.getMaterials() == null) {
            throw new RuntimeException("Keine Kursunterlagen vorhanden");
        }

        File file = new File(course.getMaterials());
        if (!file.exists()) {
            throw new RuntimeException("Kursunterlagen nicht gefunden");
        }

        Resource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    /**
     * Uploads or replaces course materials (ADMIN only).
     *
     * @param id the course ID
     * @param file the materials file to upload
     * @return a success or error message
     */

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/materials/upload")
    public ResponseEntity<String> uploadMaterials(@PathVariable("id") Long id,
                                                  @RequestParam("file") MultipartFile file) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kurs nicht gefunden"));

        try {
            Path uploadDirPath = Paths.get(this.uploadDir);
            if (!Files.exists(uploadDirPath)) {
                Files.createDirectories(uploadDirPath);
            }

            Path filePath = uploadDirPath.resolve(file.getOriginalFilename());
            Files.write(filePath, file.getBytes());

            course.setMaterials(filePath.toString());
            courseRepository.save(course);

            return ResponseEntity.ok("Datei erfolgreich hochgeladen");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Fehler beim Hochladen: " + e.getMessage());
        }
    }
}
