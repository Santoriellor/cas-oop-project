import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Course, CourseService, Enrollment } from '../service/course.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  username = '';
  courses: Course[] = [];
  enrollments: Enrollment[] = [];
  courseModel: Course = { name: '', date: '', status: 'offen' };
  selectedFile: File | null = null;
  editId: number | null = null;

  constructor(private readonly auth: AuthService, private readonly courseService: CourseService) {}

  ngOnInit(): void {
    this.auth.me().subscribe(user => {
      this.username = user.username;
    });
    this.loadData();
  }

  loadData() {
    this.courseService.getAllCourses().subscribe(res => this.courses = res);
    this.courseService.getAllEnrollments().subscribe(res => this.enrollments = res);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  saveCourse() {
    const formData = new FormData();
    formData.append('name', this.courseModel.name);
    formData.append('date', this.courseModel.date);
    formData.append('status', this.courseModel.status);
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    if (this.editId) {
      this.courseService.updateCourse(this.editId, formData).subscribe(() => {
        this.resetForm();
        this.loadData();
      });
    } else {
      this.courseService.createCourse(formData).subscribe(() => {
        this.resetForm();
        this.loadData();
      });
    }
  }

  editCourse(course: Course) {
    this.editId = course.id!;
    this.courseModel = { ...course };
  }

  deleteCourse(id: number) {
    if (confirm('Sicher löschen?')) {
      this.courseService.deleteCourse(id).subscribe(() => this.loadData());
    }
  }

  resetForm() {
    this.editId = null;
    this.courseModel = { name: '', date: '', status: 'offen' };
    this.selectedFile = null;
  }

  getEnrollmentsForCourse(courseId: number) {
    return this.enrollments.filter(e => e.course.id === courseId);
  }
}
