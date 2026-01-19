import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Course, CourseService, Enrollment } from '../service/course.service';

/**
 * Admin dashboard component.
 *
 * <p>
 * This component provides administrative functionality for managing courses
 * and viewing enrollments. It allows administrators to:
 * </p>
 *
 * <ul>
 *   <li>View all available courses</li>
 *   <li>Create new courses</li>
 *   <li>Edit existing courses</li>
 *   <li>Delete courses</li>
 *   <li>View enrolled users per course</li>
 * </ul>
 */

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  /**
   * Username of the currently authenticated administrator.
   */
  username = '';

  /**
   * List of all courses loaded from the backend.
   */
  courses: Course[] = [];

  /**
   * List of all enrollments loaded from the backend.
   *
   * <p>
   * Used to derive per-course enrollment information.
   * </p>
   */
  enrollments: Enrollment[] = [];

  /**
   * Model bound to the course create/edit form.
   */
  courseModel: Course = { name: '', date: '', status: 'offen' };

  /**
   * Currently selected file for course material upload.
   */
  selectedFile: File | null = null;

  /**
   * ID of the course currently being edited.
   *
   * <p>
   * If {@code null}, the form is in create mode.
   * </p>
   */
  editId: number | null = null;

  /**
   * Creates a new {@link AdminDashboardComponent}.
   *
   * @param auth service used to retrieve authenticated user information
   * @param courseService service used for course and enrollment operations
   */
  constructor(private readonly auth: AuthService, private readonly courseService: CourseService) {}

  /**
   * Angular lifecycle hook invoked after component initialization.
   *
   * <p>
   * Loads the current user's profile and initializes course and enrollment data.
   * </p>
   */
  ngOnInit(): void {
    this.auth.me().subscribe(user => {
      this.username = user.username;
    });
    this.loadData();
  }

  /**
   * Loads all courses and enrollments from the backend.
   */
  loadData() {
    this.courseService.getAllCourses().subscribe(res => this.courses = res);
    this.courseService.getAllEnrollments().subscribe(res => this.enrollments = res);
  }

  /**
   * Handles file selection for course materials.
   *
   * @param event file input change event
   */
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  /**
   * Creates or updates a course depending on the current form state.
   *
   * <p>
   * Uses {@link FormData} to support optional file uploads.
   * </p>
   */
  saveCourse() {
    const formData = new FormData();
    formData.append('name', this.courseModel.name);
    formData.append('date', this.courseModel.date);
    formData.append('status', this.courseModel.status);
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    // Update existing course
    if (this.editId) {
      this.courseService.updateCourse(this.editId, formData).subscribe(() => {
        this.resetForm();
        this.loadData();
      });
    }
    // Create new course
    else {
      this.courseService.createCourse(formData).subscribe(() => {
        this.resetForm();
        this.loadData();
      });
    }
  }


  /**
   * Switches the form into edit mode for the selected course.
   *
   * @param course the course to edit
   */
  editCourse(course: Course) {
    this.editId = course.id!;
    this.courseModel = { ...course };
  }

  /**
   * Deletes a course after user confirmation.
   *
   * @param id ID of the course to delete
   */
  deleteCourse(id: number) {
    if (confirm('Sicher löschen?')) {
      this.courseService.deleteCourse(id).subscribe(() => this.loadData());
    }
  }

  /**
   * Resets the course form to its initial state.
   */
  resetForm() {
    this.editId = null;
    this.courseModel = { name: '', date: '', status: 'offen' };
    this.selectedFile = null;
  }

  /**
   * Returns all enrollments for a specific course.
   *
   * @param courseId ID of the course
   * @return list of enrollments associated with the course
   */
  getEnrollmentsForCourse(courseId: number) {
    return this.enrollments.filter(e => e.course.id === courseId);
  }
}
