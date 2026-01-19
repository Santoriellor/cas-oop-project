package ch.zhaw.casproject.repository;

import ch.zhaw.casproject.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for {@link User} entities.
 *
 * <p>
 * Provides CRUD operations and commonly used lookup methods
 * for user authentication and validation.
 * </p>
 */

public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Finds a user by email address.
     *
     * <p>
     * This method is typically used during authentication
     * and availability checks.
     * </p>
     *
     * @param email the user's email address
     * @return an {@link Optional} containing the user if found
     */

    Optional<User> findByEmail(String email);

    /**
     * Finds a user by username.
     *
     * @param username the user's unique username
     * @return an {@link Optional} containing the user if found
     */

    Optional<User> findByUsername(String username);

    /**
     * Checks whether a user with the given username exists.
     *
     * @param username the username to check
     * @return {@code true} if a user with the username exists, otherwise {@code false}
     */

    boolean existsByUsername(String username);
}
