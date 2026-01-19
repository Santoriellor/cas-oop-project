package ch.zhaw.casproject.service;

import ch.zhaw.casproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Implementation of Spring Security's {@link UserDetailsService}.
 *
 * <p>
 * This service is responsible for loading user-specific data during
 * the authentication process. It retrieves user information from
 * the database and adapts it to Spring Security's {@link UserDetails}
 * representation.
 * </p>
 *
 * <p>
 * The user's email address is used as the username for authentication.
 * </p>
 */

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    /**
     * Repository used to retrieve user data from the database.
     */

    private final UserRepository userRepository;

    /**
     * Loads a user by their email address.
     *
     * <p>
     * This method is invoked by Spring Security during authentication.
     * It converts the application's {@code User} entity into a
     * {@link UserDetails} object understood by Spring Security.
     * </p>
     *
     * @param email the user's email address (used as username)
     * @return a fully populated {@link UserDetails} instance
     * @throws UsernameNotFoundException if no user with the given email exists
     */

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // Retrieve the user entity by email or fail if not found
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Build and return a Spring Security UserDetails instance
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(user.getRoles().stream()
                        .map(Enum::name)
                        .toArray(String[]::new))
                .build();
    }
}