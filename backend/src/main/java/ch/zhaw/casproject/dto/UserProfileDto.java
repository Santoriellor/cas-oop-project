package ch.zhaw.casproject.dto;

import ch.zhaw.casproject.model.Role;
import ch.zhaw.casproject.model.User;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Data Transfer Object representing the public profile of a user.
 *
 * <p>
 * This DTO is used to expose non-sensitive user information to clients,
 * typically for the currently authenticated user.
 * </p>
 *
 * <p>
 * It is designed for read-only use and is commonly returned by REST endpoints.
 * Swagger/OpenAPI annotations are used to improve API documentation.
 * </p>
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(name = "UserProfile", description = "Public profile information of the authenticated user")
public class UserProfileDto {

    /**
     * Unique identifier of the user.
     */
    @Schema(description = "User identifier")
    private UUID id;

    /**
     * Email address of the user.
     */
    @Schema(description = "Email address", example = "jane.doe@example.com")
    private String email;

    /**
     * Public display username.
     */
    @Schema(description = "Display username", example = "janedoe")
    private String username;

    /**
     * Set of role names assigned to the user.
     *
     * <p>
     * Roles are represented as strings (e.g. {@code ROLE_USER}, {@code ROLE_ADMIN})
     * to avoid exposing internal role entities.
     * </p>
     */

    @Schema(description = "Assigned roles", example = "[ 'ROLE_USER' ]")
    private Set<String> roles;

    /**
     * Timestamp when the user account was created.
     */
    @Schema(description = "Creation timestamp")
    private OffsetDateTime createdAt;

    /**
     * Timestamp of the user's last successful login.
     */
    @Schema(description = "Last successful login timestamp")
    private OffsetDateTime lastLogin;

    /**
     * Creates a {@link UserProfileDto} from a {@link User} entity.
     *
     * <p>
     * This method performs a safe transformation of the user entity into
     * a DTO by mapping roles to their string names and excluding sensitive
     * information such as passwords.
     * </p>
     *
     * @param u the user entity
     * @return a populated {@link UserProfileDto}, or {@code null} if the input is {@code null}
     */
    public static UserProfileDto from(User u) {
        if (u == null) return null;
        return UserProfileDto.builder()
                .id(u.getId())
                .email(u.getEmail())
                .username(u.getUsername())
                .roles(u.getRoles().stream().map(Role::name).collect(Collectors.toSet()))
                .createdAt(u.getCreatedAt())
                .lastLogin(u.getLastLogin())
                .build();
    }
}
