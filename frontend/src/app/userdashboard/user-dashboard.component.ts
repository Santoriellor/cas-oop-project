import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { CourseService, Enrollment, Certificate } from '../service/course.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  username = '';
  enrollments: Enrollment[] = [];
  certificates: Certificate[] = [];

  constructor(private readonly auth: AuthService, private readonly courseService: CourseService) {}

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
