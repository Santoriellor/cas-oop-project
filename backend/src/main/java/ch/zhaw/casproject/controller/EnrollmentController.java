package ch.zhaw.casproject.controller;

import ch.zhaw.casproject.model.Course;
import ch.zhaw.casproject.model.Enrollment;
import ch.zhaw.casproject.model.User;
import ch.zhaw.casproject.repository.CourseRepository;
import ch.zhaw.casproject.repository.EnrollmentRepository;
import ch.zhaw.casproject.repository.UserRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    // Alle Anmeldungen anzeigen (optional)
    @GetMapping
    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Enrollment> getEnrollmentsForUser(@PathVariable("userId") UUID userId) {
        return enrollmentRepository.findByUserId(userId);
    }

    @GetMapping("/me")
    public List<Enrollment> getMyEnrollments(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User nicht gefunden"));
        return enrollmentRepository.findByUserId(user.getId());
    }


    // Anmeldung erstellen
    @PostMapping
    public Enrollment createEnrollment(@RequestBody EnrollmentRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User nicht gefunden"));
        
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Kurs nicht gefunden"));

        // wenn direkt HTTP Request Prüfung: Kurs darf nicht beendet sein
        if ("beendet".equalsIgnoreCase(course.getStatus())) {
            throw new RuntimeException("Anmeldung nicht möglich: Kurs ist beendet");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);
        enrollment.setStatus("angemeldet");

        return enrollmentRepository.save(enrollment);
    }
}

// Hilfsklasse für POST Body
@Data
class EnrollmentRequest {
    private Long courseId;
}
