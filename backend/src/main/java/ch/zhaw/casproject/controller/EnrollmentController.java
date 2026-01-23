package ch.zhaw.casproject.controller;

import ch.zhaw.casproject.model.Course;
import ch.zhaw.casproject.model.Enrollment;
import ch.zhaw.casproject.model.User;
import ch.zhaw.casproject.repository.CourseRepository;
import ch.zhaw.casproject.repository.EnrollmentRepository;
import ch.zhaw.casproject.repository.UserRepository;
import ch.zhaw.casproject.service.EmailService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller responsible for course enrollment operations.
 *
 * <p>
 * This controller provides endpoints for:
 * <ul>
 *   <li>Listing all enrollments</li>
 *   <li>Retrieving enrollments for a specific user</li>
 *   <li>Retrieving enrollments for the currently authenticated user</li>
 *   <li>Creating new course enrollments</li>
 * </ul>
 * </p>
 */

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    /**
     * Repository used to access and persist {@link Enrollment} entities.
     */

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    /**
     * Repository used to resolve {@link User} entities.
     */

    @Autowired
    private UserRepository userRepository;

    /**
     * Repository used to resolve {@link Course} entities.
     */

    @Autowired
    private CourseRepository courseRepository;


    @Autowired
    private EmailService emailService;



    /**
     * Returns all enrollments.
     *
     * <p>
     * This endpoint may be useful for administrative or debugging purposes.
     * </p>
     *
     * @return a list of all {@link Enrollment} records
     */

    @GetMapping
    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    /**
     * Returns all enrollments for a specific user.
     *
     * @param userId the unique identifier of the user
     * @return a list of enrollments associated with the given user
     */

    @GetMapping("/user/{userId}")
    public List<Enrollment> getEnrollmentsForUser(@PathVariable("userId") UUID userId) {
        return enrollmentRepository.findByUserId(userId);
    }

    /**
     * Returns all enrollments of the currently authenticated user.
     *
     * @param userDetails the authenticated user's details
     * @return a list of enrollments belonging to the current user
     */

    @GetMapping("/me")
    public List<Enrollment> getMyEnrollments(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User nicht gefunden"));
        return enrollmentRepository.findByUserId(user.getId());
    }


    /**
     * Creates a new enrollment for the currently authenticated user.
     *
     * <p>
     * Enrollment is only allowed if the course is not already completed
     * (i.e., its status is not {@code "beendet"}).
     * </p>
     *
     * @param request the enrollment request containing the course ID
     * @param userDetails the authenticated user's details
     * @return the persisted {@link Enrollment}
     */

    @PostMapping
    public Enrollment createEnrollment(@RequestBody EnrollmentRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User nicht gefunden"));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Kurs nicht gefunden"));

        // Prevent enrollment if the course is already completed
        if ("beendet".equalsIgnoreCase(course.getStatus())) {
            throw new RuntimeException("Anmeldung nicht möglich: Kurs ist beendet");
        }

        // Create and persist a new enrollment
        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);
        enrollment.setStatus("angemeldet");

        // --- SPEICHERN UND IN VARIABLE ZURÜCKGEBEN ---
        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);


        // --- EMAIL VERSAND ---
        try {
            emailService.sendEmail(
                    user.getEmail(),
                    "Kursanmeldung bestätigt",
                    "Hallo " + user.getUsername() + ",\n\nSie haben sich erfolgreich für den Kurs '" + course.getName() + "' angemeldet.\n\nViele Grüße\nDas Kurs Team Retrained"
            );
        } catch (Exception e) {
            // Optional: Loggen, falls E-Mail nicht gesendet werden kann
            System.err.println("Fehler beim Senden der Email: " + e.getMessage());
        }

        return savedEnrollment;


    }
}

/**
 * Helper DTO representing the request body for creating an enrollment.
 */
@Data
class EnrollmentRequest {
    private Long courseId;
}
