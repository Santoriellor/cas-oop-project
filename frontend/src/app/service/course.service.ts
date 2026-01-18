import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Course data model.
 *
 * <p>
 * Represents a training course including its metadata
 * and optional learning materials.
 * </p>
 */
export interface Course {
  id?: number;
  name: string;
  date: string;
  status: string;
  materials?: string;
}

/**
 * Enrollment data model.
 *
 * <p>
 * Represents a user's enrollment in a specific course.
 * </p>
 */
export interface Enrollment {
  id?: number;
  user: any;
  course: Course;
  status: string;
}

/**
 * Certificate data model.
 *
 * <p>
 * Represents a certificate issued to a user
 * after successful course completion.
 * </p>
 */
export interface Certificate {
  id?: number;
  user: any;
  course: Course;
  filePath: string;
}

/**
 * Service for managing courses, enrollments, and certificates.
 *
 * <p>
 * This service acts as a centralized known API for all
 * course-related backend operations, including:
 * </p>
 *
 * <ul>
 *   <li>Course CRUD operations</li>
 *   <li>User enrollments</li>
 *   <li>Certificate retrieval and downloads</li>
 *   <li>Material downloads</li>
 * </ul>
 */
@Injectable({ providedIn: 'root' })
export class CourseService {

  /**
   * Base API URL for course-related endpoints.
   */
  private api = `${environment.apiUrl}`;

  /**
   * Creates a new {@link CourseService}.
   *
   * @param http Angular HTTP client used to communicate with the backend
   */
  constructor(private http: HttpClient) { }

  // =====================
  // Courses
  // =====================

  /**
   * Retrieves all available courses.
   *
   * @return an observable containing a list of courses
   */
  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.api}/courses`);
  }

  /**
   * Creates a new course.
   *
   * <p>
   * The request supports multipart form data
   * for optional file uploads.
   * </p>
   *
   * @param formData course data including optional materials
   * @return the created course
   */
  createCourse(formData: FormData): Observable<Course> {
    return this.http.post<Course>(`${this.api}/courses`, formData);
  }

  /**
   * Updates an existing course.
   *
   * @param id ID of the course to update
   * @param formData updated course data
   * @return the updated course
   */
  updateCourse(id: number, formData: FormData): Observable<Course> {
    return this.http.put<Course>(`${this.api}/courses/${id}`, formData);
  }

  /**
   * Deletes a course by its ID.
   *
   * @param id ID of the course to delete
   */
  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/courses/${id}`);
  }

  /*uploadMaterials(id: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.api}/courses/${id}/materials/upload`, formData, { responseType: 'text' });
  }*/

  /**
   * Downloads course materials for a specific course.
   *
   * <p>
   * The response is returned as a binary Blob
   * suitable for file download.
   * </p>
   *
   * @param id course ID
   * @return a Blob containing the course materials
   */
  downloadMaterials(id: number): Observable<Blob> {
    return this.http.get(
      `${this.api}/courses/${id}/materials/download`,
      { responseType: 'blob' }
    );
  }

  // =====================
  // Enrollments
  // =====================

  /**
   * Retrieves all enrollments (admin use case).
   *
   * @return a list of all enrollments
   */
  getAllEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.api}/enrollments`);
  }

  /**
   * Retrieves enrollments of the currently authenticated user.
   *
   * @return a list of the user's enrollments
   */
  getMyEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.api}/enrollments/me`);
  }

  /**
   * Enrolls the current user in a course.
   *
   * @param courseId ID of the course to enroll in
   * @return the created enrollment
   */
  enroll(courseId: number): Observable<Enrollment> {
    return this.http.post<Enrollment>(`${this.api}/enrollments`, { courseId });
  }

  // =====================
  // Certificates
  // =====================

  /**
   * Retrieves all certificates of the current user.
   *
   * @return a list of certificates
   */
  getMyCertificates(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${this.api}/certificates/me`);
  }

  /**
   * Downloads a certificate file.
   *
   * <p>
   * The response is returned as a binary Blob
   * suitable for file download.
   * </p>
   *
   * @param id certificate ID
   * @return a Blob containing the certificate file
   */
  downloadCertificate(id: number): Observable<Blob> {
    return this.http.get(
      `${this.api}/certificates/${id}/download`,
      { responseType: 'blob' }
    );
  }

}
