package ch.zhaw.casproject.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * JPA entity representing an application user.
 *
 * <p>
 * This entity stores authentication and authorization data, including
 * credentials, roles, and audit timestamps.
 * </p>
 *
 * <p>
 * The entity uses a UUID as its primary key and relies on Lombok
 * to reduce boilerplate code for getters, setters, and constructors.
 * </p>
 */

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    /**
     * Primary key of the user entity.
     *
     * <p>
     * A UUID is generated automatically before persisting the entity
     * if no ID has been assigned.
     * </p>
     */

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    /**
     * Initializes the UUID before the entity is persisted.
     *
     * <p>
     * This method is automatically invoked by JPA prior to persisting
     * the entity.
     * </p>
     */

    @PrePersist
    public void prePersist() {
        if (id == null) id = UUID.randomUUID();
    }

    /**
     * Email address of the user.
     *
     * <p>
     * This field must be unique and is typically used as the login identifier.
     * </p>
     */

    @Column(nullable = false, unique = true)
    private String email;

    /**
     * Public username of the user.
     *
     * <p>
     * This field is unique and may be displayed publicly.
     * </p>
     */

    @Column(unique = true, nullable = false)
    private String username;

    /**
     * Hashed password of the user.
     *
     * <p>
     * This field is excluded from JSON serialization to prevent
     * accidental exposure.
     * </p>
     */

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    /**
     * Set of roles assigned to the user.
     *
     * <p>
     * Roles are stored in a separate collection table and eagerly fetched
     * to ensure availability during authentication and authorization.
     * </p>
     */

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    private Set<Role> roles = new HashSet<>();

    /**
     * Timestamp when the user account was created.
     *
     * <p>
     * This value is automatically set when the entity is persisted.
     * </p>
     */

    @CreationTimestamp
    @Column(name = "created_at", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime createdAt;

    /**
     * Timestamp of the user's last successful login.
     *
     * <p>
     * This field may be updated manually after authentication.
     * </p>
     */

    @Column(name = "last_login", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime lastLogin;
}
