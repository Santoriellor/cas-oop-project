package ch.zhaw.casproject.repository;

import ch.zhaw.casproject.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
    // Optional: später z.B. nach Status filtern
}
