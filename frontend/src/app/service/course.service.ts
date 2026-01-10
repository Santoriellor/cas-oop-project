import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Course {
  id?: number;
  name: string;
  date: string;
  status: string;
  materials?: string;
}

export interface Enrollment {
  id?: number;
  user: any;
  course: Course;
  status: string;
}

export interface Certificate {
  id?: number;
  user: any;
  course: Course;
  filePath: string;
}

@Injectable({ providedIn: 'root' })
export class CourseService {
  private api = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  // Courses
  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.api}/courses`);
  }

  createCourse(formData: FormData): Observable<Course> {
    return this.http.post<Course>(`${this.api}/courses`, formData);
  }

  updateCourse(id: number, formData: FormData): Observable<Course> {
    return this.http.put<Course>(`${this.api}/courses/${id}`, formData);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/courses/${id}`);
  }

  /*uploadMaterials(id: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.api}/courses/${id}/materials/upload`, formData, { responseType: 'text' });
  }*/

  downloadMaterials(id: number): Observable<Blob> {
    return this.http.get(
      `${this.api}/courses/${id}/materials/download`,
      { responseType: 'blob' }
    );
  }

  // Enrollments
  getAllEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.api}/enrollments`);
  }

  getMyEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.api}/enrollments/me`);
  }

  enroll(courseId: number): Observable<Enrollment> {
    return this.http.post<Enrollment>(`${this.api}/enrollments`, { courseId });
  }

  // Certificates
  getMyCertificates(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${this.api}/certificates/me`);
  }

  downloadCertificate(id: number): Observable<Blob> {
    return this.http.get(
      `${this.api}/certificates/${id}/download`,
      { responseType: 'blob' }
    );
  }

}
