package ch.zhaw.casproject.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDate;

/**
 * JPA entity representing a course.
 *
 * <p>
 * A course defines a learning unit that users can enroll in.
 * It contains basic metadata such as name, date, status, and
 * optional course materials.
 * </p>
 */

@Entity
public class Course {

    /**
     * Primary key of the course entity.
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Name of the course.
     */

    private String name;

    /**
     * Scheduled date of the course.
     */
    private LocalDate date;
    /**
     * Current status of the course.
     *
     * <p>
     * Example values include:
     * <ul>
     *   <li>{@code "offen"} (open)</li>
     *   <li>{@code "laufend"} (in progress)</li>
     *   <li>{@code "abgeschlossen"} or {@code "beendet"} (completed)</li>
     * </ul>
     * </p>
     */
    private String status;

    /**
     * Optional reference to course materials.
     *
     * <p>
     * This may contain a file system path or a URL pointing
     * to the course materials.
     * </p>
     */
    private String materials;

    /**
     * Returns the course ID.
     *
     * @return the course ID
     */

    public Long getId() { return id; }

    /**
     * Sets the course ID.
     *
     * @param id the course ID
     */

    public void setId(Long id) { this.id = id; }

    /**
     * Returns the course name.
     *
     * @return the course name
     */

    public String getName() { return name; }

    /**
     * Sets the course name.
     *
     * @param name the course name
     */

    public void setName(String name) { this.name = name; }

    /**
     * Returns the course date.
     *
     * @return the course date
     */

    public LocalDate getDate() { return date; }

    /**
     * Sets the course date.
     *
     * @param date the course date
     */

    public void setDate(LocalDate date) { this.date = date; }

    /**
     * Returns the current course status.
     *
     * @return the course status
     */

    public String getStatus() { return status; }

    /**
     * Sets the current course status.
     *
     * @param status the course status
     */

    public void setStatus(String status) { this.status = status; }

    /**
     * Returns the course materials reference.
     *
     * @return the materials reference (file path or URL)
     */

    public String getMaterials() { return materials; }

    /**
     * Sets the course materials reference.
     *
     * @param materials the materials reference
     */

    public void setMaterials(String materials) { this.materials = materials; }
}
