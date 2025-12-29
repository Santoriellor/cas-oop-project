import { Component, OnInit } from '@angular/core';
import { Course, CourseService, Enrollment } from '../service/course.service';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="bg-white shadow rounded p-6">
      <h2 class="text-2xl font-bold mb-4">Admin Dashboard</h2>

      <!-- Course Form -->
      <div class="mb-8 p-4 border rounded bg-gray-50">
        <h3 class="text-lg font-semibold mb-2">{{ editId ? 'Kurs bearbeiten' : 'Neuen Kurs erstellen' }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input [(ngModel)]="courseModel.name" placeholder="Kursname" class="border p-2 rounded">
          <input [(ngModel)]="courseModel.date" type="date" class="border p-2 rounded">
          <select [(ngModel)]="courseModel.status" class="border p-2 rounded">
            <option value="offen">Offen</option>
            <option value="laufend">Laufend</option>
            <option value="beendet">Beendet</option>
          </select>
          <input type="file" (change)="onFileSelected($event)" class="border p-2 rounded">
        </div>
        <div class="mt-4 flex gap-2">
          <button (click)="saveCourse()" class="bg-indigo-600 text-white px-4 py-2 rounded">
            {{ editId ? 'Aktualisieren' : 'Erstellen' }}
          </button>
          <button *ngIf="editId" (click)="resetForm()" class="bg-gray-400 text-white px-4 py-2 rounded">Abbrechen</button>
        </div>
      </div>

      <!-- Course List -->
      <div>
        <h3 class="text-xl font-bold mb-2">Kurse</h3>
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
                <button (click)="editCourse(course)" class="text-indigo-600 hover:underline">Bearbeiten</button>
                <button (click)="deleteCourse(course.id!)" class="text-red-600 hover:underline">Löschen</button>
              </div>
            </div>

            <!-- Enrollments -->
            <div class="mt-2 pl-4 border-l-2">
              <h4 class="text-sm font-semibold text-gray-500">Teilnehmer:</h4>
              <ul class="text-sm">
                <li *ngFor="let e of getEnrollmentsForCourse(course.id!)">
                  {{ e.user.username }} ({{ e.user.email }})
                </li>
                <li *ngIf="getEnrollmentsForCourse(course.id!).length === 0" class="text-gray-400">Keine Teilnehmer</li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  courses: Course[] = [];
  enrollments: Enrollment[] = [];
  courseModel: Course = { name: '', date: '', status: 'offen' };
  selectedFile: File | null = null;
  editId: number | null = null;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
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
