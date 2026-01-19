package ch.zhaw.casproject.model;


/**
 * Enumeration defining the available user roles in the system.
 *
 * <p>
 * Roles are used for authorization and access control within the application.
 * They are typically assigned to users and evaluated by Spring Security
 * during authentication and authorization.
 * </p>
 */

public enum Role {

    /**
     * Standard user role.
     *
     * <p>
     * Users with this role can access general application features
     * such as course enrollment and certificate viewing.
     * </p>
     */
  ROLE_USER,

    /**
     * Administrator role.
     *
     * <p>
     * Users with this role have elevated privileges, such as managing
     * courses, users, and system-wide configurations.
     * </p>
     */

  ROLE_ADMIN
}
