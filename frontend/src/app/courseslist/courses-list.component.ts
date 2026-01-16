import { Component, OnInit } from '@angular/core';
import { Certificate, Course, CourseService, Enrollment } from '../service/course.service';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss']
})
export class CoursesListComponent implements OnInit {
  courses: Course[] = [];
  myEnrollments: Enrollment[] = [];
  myCertificates: Certificate[] = [];

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.courseService.getAllCourses().subscribe(res => this.courses = res);
    this.courseService.getMyEnrollments().subscribe(res => this.myEnrollments = res);
    this.courseService.getMyCertificates().subscribe(res => this.myCertificates = res);
  }

  enroll(courseId: number) {
    this.courseService.enroll(courseId).subscribe(() => this.loadData());
  }

  isEnrolled(courseId: number): boolean {
    return this.myEnrollments.some(e => e.course.id === courseId);
  }

  hasCertificate(courseId: number): boolean {
    return this.myCertificates.some(c => c.course.id === courseId);
  }

  downloadMaterials(course: Course) {
    this.courseService.downloadMaterials(course.id!).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${course.materials}`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  downloadCert(id: number) {
    this.courseService.downloadCertificate(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${id}.pdf`; // or .png
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
