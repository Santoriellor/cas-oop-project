import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CourseDocumentDto, UserDocumentDto} from "../model/document.models";
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private baseUrl = '/api'; //passt, wenn Proxy oder Backend unter gleichem Host

  constructor(private http: HttpClient) {}

  getDocumentsByCourse(courseId: number): Observable<CourseDocumentDto[]> {
    return this.http.get<CourseDocumentDto[]> (
      `${this.baseUrl}/courses/${courseId}/documents`
    );
  }

  getMyDocuments(): Observable<UserDocumentDto[]> {
    return this.http.get<UserDocumentDto[]>(
      `${this.baseUrl}/user/me/documents`
    );
  }

  uploadDocument(courseId: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<void>(`${this.baseUrl}/courses/${courseId}/documents`, formData);
  }

  deleteDocument(documentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/documents/${documentId}`);
  }
 }
