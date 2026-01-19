package ch.zhaw.casproject.repository;

import ch.zhaw.casproject.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

/**
 * Repository interface for {@link Certificate} entities.
 *
 * <p>
 * Provides standard CRUD operations via {@link JpaRepository}
 * and additional query methods for accessing certificates
 * associated with a specific user.
 * </p>
 */

public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    /**
     * Returns all certificates belonging to a specific user.
     *
     * <p>
     * This method uses Spring Data JPA query derivation to
     * retrieve certificates based on the user's unique identifier.
     * </p>
     *
     * @param userId the unique identifier of the user
     * @return a list of certificates associated with the given user
     */

    List<Certificate> findByUserId(UUID userId);
}
