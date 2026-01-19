/**
 * Data Transfer Object representing a document associated with a course.
 *
 * <p>
 * This interface is typically used when retrieving documents
 * available for a specific course.
 * </p>
 */
export interface CourseDocumentDto {

  /**
   * Unique identifier of the document.
   */
  id: number;

  /**
   * Original filename of the document.
   */
  filename: string;

  /**
   * MIME content type of the document.
   *
   * <p>
   * Example: {@code application/pdf}
   * </p>
   */
  contentType: string;

  /**
   * Upload timestamp of the document.
   *
   * <p>
   * Represented as an ISO 8601 string.
   * </p>
   */
  uploadedAt: string; //ISO String
}

/**
* Data Transfer Object representing a user-specific document.
*
* <p>
* This interface is typically used when retrieving documents
* associated with a user's enrolled courses.
* </p>
*/
export interface UserDocumentDto {

  /**
   * Unique identifier of the document.
   */
  id: number;

  /**
   * Original filename of the document.
   */
  filename: string;

  /**
   * Identifier of the related course.
   */
  courseId: number;

  /**
   * Title of the related course.
   */
  courseTitle: string;
}
