package ch.zhaw.casproject.repository;

import ch.zhaw.casproject.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository interface for {@link Course} entities.
 *
 * <p>
 * Provides basic CRUD operations and query execution through
 * Spring Data JPA.
 * </p>
 *
 * <p>
 * Additional query methods (e.g. filtering by status) can be
 * added here in the future if needed.
 * </p>
 */

public interface CourseRepository extends JpaRepository<Course, Long> {
    // Optional: later e.g. filtering by course status
}
