package ch.zhaw.casproject.model;

import jakarta.persistence.*;

/**
 * JPA entity representing a course completion certificate.
 *
 * <p>
 * A certificate links a {@link User} to a completed {@link Course}.
 * It may optionally reference a generated PDF file via a file path.
 * </p>
 *
 * <p>
 * Certificate generation is typically triggered when a course
 * reaches a completed state.
 * </p>
 */

@Entity
public class Certificate {

    /**
     * Primary key of the certificate entity.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The user to whom this certificate belongs.
     *
     * <p>
     * Many certificates may belong to the same user.
     * </p>
     */
    @ManyToOne
    private User user;

    /**
     * The course for which this certificate was issued.
     *
     * <p>
     * Many certificates may be associated with the same course.
     * </p>
     */
    @ManyToOne
    private Course course;

    /**
     * Optional file system path to the generated certificate PDF.
     *
     * <p>
     * This field may be {@code null} if the certificate file
     * is generated dynamically or stored elsewhere.
     * </p>
     */

    private String filePath;

    /**
     * Default constructor required by JPA.
     */
    public Certificate() {}

    /**
     * Creates a new certificate with the given user, course, and file path.
     *
     * @param user the user who received the certificate
     * @param course the completed course
     * @param filePath optional path to the certificate file
     */

    public Certificate(User user, Course course, String filePath) {
        this.user = user;
        this.course = course;
        this.filePath = filePath;
    }

    /**
     * Returns the certificate ID.
     *
     * @return the certificate ID
     */
    public Long getId() { return id; }

    /**
     * Returns the user associated with this certificate.
     *
     * @return the user entity
     */

    public User getUser() { return user; }

    /**
     * Sets the user associated with this certificate.
     *
     * @param user the user entity
     */

    public void setUser(User user) { this.user = user; }

    /**
     * Returns the course associated with this certificate.
     *
     * @return the course entity
     */

    public Course getCourse() { return course; }

    /**
     * Sets the course associated with this certificate.
     *
     * @param course the course entity
     */

    public void setCourse(Course course) { this.course = course; }

    /**
     * Returns the file path of the certificate PDF.
     *
     * @return the file path, or {@code null} if not stored
     */

    public String getFilePath() { return filePath; }

    /**
     * Sets the file path of the certificate PDF.
     *
     * @param filePath the file system path
     */

    public void setFilePath(String filePath) { this.filePath = filePath; }
}
