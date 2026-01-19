import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CourseDocumentDto, UserDocumentDto} from "../model/document.models";
import { Observable } from 'rxjs';

/**
 * Service for managing course and user documents.
 *
 * <p>
 * This service provides methods for:
 * </p>
 *
 * <ul>
 *   <li>Retrieving documents for a specific course</li>
 *   <li>Retrieving documents belonging to the current user</li>
 *   <li>Uploading documents to a course</li>
 *   <li>Deleting existing documents</li>
 * </ul>
 *
 * <p>
 * The base URL assumes either a proxy configuration
 * or that the frontend is served from the same host as the backend.
 * </p>
 */
@Injectable({ providedIn: 'root' })
export class DocumentService {

  /**
   * Base URL for document-related API endpoints.
   *
   * <p>
   * This is typically {@code /api} when using an Angular proxy
   * or when the backend is served from the same host.
   * </p>
   */
  private baseUrl = '/api'; // fits when using a proxy or same-host backend

  /**
   * Creates a new {@link DocumentService}.
   *
   * @param http Angular HTTP client used to communicate with the backend
   */
  constructor(private http: HttpClient) {}

  /**
   * Retrieves all documents associated with a specific course.
   *
   * @param courseId ID of the course
   * @return an observable containing the course documents
   */
  getDocumentsByCourse(courseId: number): Observable<CourseDocumentDto[]> {
    return this.http.get<CourseDocumentDto[]> (
      `${this.baseUrl}/courses/${courseId}/documents`
    );
  }

  /**
   * Retrieves all documents associated with the currently authenticated user.
   *
   * @return an observable containing the user's documents
   */
  getMyDocuments(): Observable<UserDocumentDto[]> {
    return this.http.get<UserDocumentDto[]>(
      `${this.baseUrl}/user/me/documents`
    );
  }

  /**
   * Uploads a new document for a specific course.
   *
   * <p>
   * The file is sent using multipart form data.
   * </p>
   *
   * @param courseId ID of the course
   * @param file file to upload
   */
  uploadDocument(courseId: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<void>(`${this.baseUrl}/courses/${courseId}/documents`, formData);
  }

  /**
   * Deletes a document by its ID.
   *
   * @param documentId ID of the document to delete
   */
  deleteDocument(documentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/documents/${documentId}`);
  }
 }
