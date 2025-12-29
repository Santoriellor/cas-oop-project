import { Component, OnInit } from '@angular/core';
import { Certificate, Course, CourseService, Enrollment } from '../service/course.service';

@Component({
  selector: 'app-courses-list',
  template: `
    <div class="bg-white shadow rounded p-6">
      <h2 class="text-2xl font-bold mb-4">Verfügbare Kurse</h2>

      <ul class="space-y-4">
        <li *ngFor="let course of courses" class="border p-4 rounded shadow-sm">
          <div class="flex justify-between items-center">
            <div>
              <span class="font-bold text-lg">{{ course.name }}</span>
              <span class="ml-2 text-gray-600">({{ course.date }})</span>
              <span class="ml-2 px-2 py-1 rounded text-xs"
                    [ngClass]="{'bg-green-100 text-green-800': course.status === 'offen',
                               'bg-blue-100 text-blue-800': course.status === 'laufend',
                               'bg-red-100 text-red-800': course.status === 'beendet'}">
                {{ course.status }}
              </span>
            </div>

            <div class="flex gap-2">
              <!-- Enroll Button -->
              <button *ngIf="!isEnrolled(course.id!) && course.status !== 'beendet'"
                      (click)="enroll(course.id!)"
                      class="bg-indigo-600 text-white px-3 py-1 rounded text-sm">
                Anmelden
              </button>
              <span *ngIf="isEnrolled(course.id!)" class="text-green-600 font-semibold text-sm">Angemeldet</span>
              <span *ngIf="!isEnrolled(course.id!) && course.status === 'beendet'" class="text-gray-400 text-sm">Beendet</span>

              <!-- Download Materials -->
              <button *ngIf="isEnrolled(course.id!) && course.materials"
                      (click)="downloadMaterials(course.id!)"
                      class="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm">
                Unterlagen
              </button>

              <!-- Download Certificate -->
              <button *ngIf="hasCertificate(course.id!) && course.status === 'beendet'"
                      (click)="downloadCertificate(course.id!)"
                      class="bg-yellow-500 text-white px-3 py-1 rounded text-sm">
                Zertifikat
              </button>
            </div>
          </div>
        </li>
      </ul>

      <div *ngIf="courses.length === 0" class="text-center text-gray-500 py-8">
        Keine Kurse verfügbar.
      </div>
    </div>
  `
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

  downloadMaterials(courseId: number) {
    this.courseService.downloadMaterials(courseId);
  }

  downloadCertificate(courseId: number) {
    const cert = this.myCertificates.find(c => c.course.id === courseId);
    if (cert) {
      this.courseService.downloadCertificate(cert.id!);
    }
  }
}
