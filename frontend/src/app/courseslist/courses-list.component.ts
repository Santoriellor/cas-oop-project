import { Component, OnInit } from '@angular/core';
import { Certificate, Course, CourseService, Enrollment } from '../service/course.service';

/**
 * Courses list component.
 *
 * <p>
 * This component displays all available courses and allows the
 * currently authenticated user to:
 * </p>
 *
 * <ul>
 *   <li>View available courses</li>
 *   <li>Enroll in courses</li>
 *   <li>Download course materials</li>
 *   <li>Download certificates for completed courses</li>
 * </ul>
 *
 * <p>
 * Enrollment and certificate state is derived from the user's
 * enrollments and certificates loaded from the backend.
 * </p>
 */
@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss']
})
export class CoursesListComponent implements OnInit {

  /**
   * List of all available courses.
   */
  courses: Course[] = [];

  /**
   * Enrollments of the currently authenticated user.
   */
  myEnrollments: Enrollment[] = [];

  /**
   * Certificates of the currently authenticated user.
   */
  myCertificates: Certificate[] = [];

  /**
   * Creates a new {@link CoursesListComponent}.
   *
   * @param courseService service used for course, enrollment, and certificate operations
   */
  constructor(private courseService: CourseService) {}

  /**
   * Angular lifecycle hook invoked after component initialization.
   *
   * <p>
   * Triggers initial loading of courses, enrollments, and certificates.
   * </p>
   */
  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Loads courses, user enrollments, and certificates from the backend.
   */
  loadData() {
    this.courseService.getAllCourses().subscribe(res => this.courses = res);
    this.courseService.getMyEnrollments().subscribe(res => this.myEnrollments = res);
    this.courseService.getMyCertificates().subscribe(res => this.myCertificates = res);
  }

  /**
   * Enrolls the current user in the specified course.
   *
   * @param courseId ID of the course to enroll in
   */
  enroll(courseId: number) {
    this.courseService.enroll(courseId).subscribe(() => this.loadData());
  }

  /**
   * Checks whether the current user is enrolled in a course.
   *
   * @param courseId ID of the course
   * @return {@code true} if the user is enrolled, otherwise {@code false}
   */
  isEnrolled(courseId: number): boolean {
    return this.myEnrollments.some(e => e.course.id === courseId);
  }

  /**
   * Checks whether the current user has a certificate for a course.
   *
   * @param courseId ID of the course
   * @return {@code true} if a certificate exists, otherwise {@code false}
   */
  hasCertificate(courseId: number): boolean {
    return this.myCertificates.some(c => c.course.id === courseId);
  }

  /**
   * Downloads course materials for a given course.
   *
   * @param course the course whose materials should be downloaded
   */
  downloadMaterials(course: Course) {
    this.courseService.downloadMaterials(course.id!).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = `${course.materials}`;
      a.click();

      // Release the object URL to free memory
      window.URL.revokeObjectURL(url);
    });
  }

  /**
   * Downloads the certificate for a completed course.
   *
   * @param id ID of the certificate/course
   */
  downloadCert(id: number) {
    this.courseService.downloadCertificate(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${id}.pdf`; // or .png
      a.click();

      // Release the object URL to free memory
      window.URL.revokeObjectURL(url);
    });
  }
}
