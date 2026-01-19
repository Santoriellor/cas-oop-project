package ch.zhaw.casproject.repository;

import ch.zhaw.casproject.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

/**
 * Repository interface for {@link Enrollment} entities.
 *
 * <p>
 * Provides standard CRUD operations via {@link JpaRepository}
 * and additional query methods for accessing enrollments
 * associated with a specific user.
 * </p>
 */

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    /**
     * Returns all enrollments belonging to a specific user.
     *
     * <p>
     * This method uses Spring Data JPA query derivation to
     * retrieve enrollments based on the user's unique identifier.
     * </p>
     *
     * @param userId the unique identifier of the user
     * @return a list of enrollments associated with the given user
     */

    List<Enrollment> findByUserId(UUID userId);
}
