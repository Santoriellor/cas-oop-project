package ch.zhaw.casproject.model;

import jakarta.persistence.*;

/**
 * JPA entity representing a user's enrollment in a course.
 *
 * <p>
 * An enrollment links a {@link User} to a {@link Course} and
 * tracks the user's participation status.
 * </p>
 */

@Entity
public class Enrollment {

    /**
     * Primary key of the enrollment entity.
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The user who is enrolled in the course.
     *
     * <p>
     * Many enrollments may belong to the same user.
     * </p>
     */

    @ManyToOne
    private User user;

    /**
     * The course the user is enrolled in.
     *
     * <p>
     * Many enrollments may belong to the same course.
     * </p>
     */

    @ManyToOne
    private Course course;

    /**
     * Current enrollment status.
     *
     * <p>
     * Example values include:
     * <ul>
     *   <li>{@code "angemeldet"} (enrolled)</li>
     *   <li>{@code "abgeschlossen"} (completed)</li>
     * </ul>
     * </p>
     */

    private String status;

    /**
     * Returns the enrollment ID.
     *
     * @return the enrollment ID
     */

    public Long getId() { return id; }

    /**
     * Sets the enrollment ID.
     *
     * @param id the enrollment ID
     */

    public void setId(Long id) { this.id = id; }

    /**
     * Returns the enrolled user.
     *
     * @return the user entity
     */

    public User getUser() { return user; }

    /**
     * Sets the enrolled user.
     *
     * @param user the user entity
     */

    public void setUser(User user) { this.user = user; }

    /**
     * Returns the course associated with this enrollment.
     *
     * @return the course entity
     */

    public Course getCourse() { return course; }

    /**
     * Sets the course associated with this enrollment.
     *
     * @param course the course entity
     */

    public void setCourse(Course course) { this.course = course; }

    /**
     * Returns the current enrollment status.
     *
     * @return the enrollment status
     */

    public String getStatus() { return status; }

    /**
     * Sets the current enrollment status.
     *
     * @param status the enrollment status
     */

    public void setStatus(String status) { this.status = status; }
}
