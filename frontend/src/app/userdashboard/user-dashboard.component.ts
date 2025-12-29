import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { CourseService, Enrollment, Certificate } from '../service/course.service';

@Component({
  selector: 'app-user-dashboard',
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">User Dashboard</h1>
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-2">Welcome, {{username}}!</h2>
        <p class="text-gray-600 mb-4">Here you can see your courses and certifications.</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="border rounded-lg p-4">
            <h3 class="font-bold mb-2">My Courses</h3>
            <ul *ngIf="enrollments.length > 0; else noCourses">
              <li *ngFor="let e of enrollments" class="mb-2 p-2 border-b last:border-0">
                <div class="font-medium">{{e.course.name}}</div>
                <div class="text-sm text-gray-500">Status: {{e.status}} | Date: {{e.course.date}}</div>
              </li>
            </ul>
            <ng-template #noCourses>
              <p class="text-sm text-gray-500 italic">No courses enrolled yet.</p>
            </ng-template>
          </div>
          <div class="border rounded-lg p-4">
            <h3 class="font-bold mb-2">My Certifications</h3>
            <ul *ngIf="certificates.length > 0; else noCerts">
              <li *ngFor="let c of certificates" class="mb-2 p-2 border-b last:border-0 flex justify-between items-center">
                <div>
                  <div class="font-medium">{{c.course.name}}</div>
                </div>
                <button (click)="downloadCert(c.id!)" class="text-blue-600 hover:underline text-sm">
                  Download
                </button>
              </li>
            </ul>
            <ng-template #noCerts>
              <p class="text-sm text-gray-500 italic">No certifications earned yet.</p>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserDashboardComponent implements OnInit {
  username = '';
  enrollments: Enrollment[] = [];
  certificates: Certificate[] = [];

  constructor(private auth: AuthService, private courseService: CourseService) {}

  ngOnInit() {
    this.auth.me().subscribe(user => {
      this.username = user.username;
    });

    this.courseService.getMyEnrollments().subscribe(res => {
      this.enrollments = res;
    });

    this.courseService.getMyCertificates().subscribe(res => {
      this.certificates = res;
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
