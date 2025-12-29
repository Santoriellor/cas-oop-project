package ch.zhaw.casproject.controller;

import ch.zhaw.casproject.model.Certificate;
import ch.zhaw.casproject.model.Course;
import ch.zhaw.casproject.model.Enrollment;
import ch.zhaw.casproject.repository.CertificateRepository;
import ch.zhaw.casproject.repository.CourseRepository;
import ch.zhaw.casproject.repository.EnrollmentRepository;
import ch.zhaw.casproject.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
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

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private CertificateService certificateService;

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private UserRepository userRepository;

    // Alle Kurse anzeigen
    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // Kurs erstellen
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Course createCourse(
            @RequestParam("name") String name,
            @RequestParam("date") String date,
            @RequestParam("status") String status,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) throws Exception {

        Course course = new Course();
        course.setName(name);
        course.setDate(LocalDate.parse(date));
        course.setStatus(status);

        if (file != null && !file.isEmpty()) {
            Path uploadDir = Paths.get("uploads");
            Files.createDirectories(uploadDir);

            Path filePath = uploadDir.resolve(file.getOriginalFilename());
            Files.write(filePath, file.getBytes());

            course.setMaterials(filePath.toString());
        }

        return courseRepository.save(course);
    }

    // Kurs löschen
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable("id") Long id) {
        courseRepository.deleteById(id);
    }

    // Kurs bearbeiten / Status ändern

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

        // Vorheriger Status merken
        String previousStatus = course.getStatus();

        // Neue Werte setzen
        course.setName(name);
        course.setDate(LocalDate.parse(date));
        course.setStatus(status);

        // Material hochladen
        if (file != null && !file.isEmpty()) {
            Path uploadDir = Paths.get("uploads");
            Files.createDirectories(uploadDir);

            Path filePath = uploadDir.resolve(file.getOriginalFilename());
            Files.write(filePath, file.getBytes());

            course.setMaterials(filePath.toString());
        }

        Course savedCourse = courseRepository.save(course);

        // ⭐ Zertifikate erzeugen, nur wenn Status auf "beendet" gewechselt ist
        if (!"beendet".equalsIgnoreCase(previousStatus) && "beendet".equalsIgnoreCase(status)) {
            List<Enrollment> enrollments = enrollmentRepository.findAll().stream()
                    .filter(e -> e.getCourse().getId().equals(id))
                    .toList();

            for (Enrollment e : enrollments) {
                // PDF erzeugen
                byte[] pdf = certificateService.generatePdf(e.getUser().getUsername(), course.getName());

                // Certificate speichern
                Certificate cert = new Certificate();
                cert.setCourse(course);
                cert.setUser(e.getUser());
                cert.setFilePath(null); // optional später Pfad/Byte[] speichern
                certificateRepository.save(cert);
            }
        }


        return savedCourse;
    }

    @GetMapping("/{id}/materials/download")
    public ResponseEntity<Resource> downloadMaterials(@PathVariable("id") Long id,
                                                      @AuthenticationPrincipal UserDetails userDetails) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kurs nicht gefunden"));

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User nicht gefunden"));

        // Prüfen: User ist für den Kurs angemeldet
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

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/materials/upload")
    public ResponseEntity<String> uploadMaterials(@PathVariable("id") Long id,
                                                  @RequestParam("file") MultipartFile file) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kurs nicht gefunden"));

        try {
            Path uploadDir = Paths.get("uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            Path filePath = uploadDir.resolve(file.getOriginalFilename());
            Files.write(filePath, file.getBytes());

            course.setMaterials(filePath.toString());
            courseRepository.save(course);

            return ResponseEntity.ok("Datei erfolgreich hochgeladen");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Fehler beim Hochladen: " + e.getMessage());
        }
    }
}
