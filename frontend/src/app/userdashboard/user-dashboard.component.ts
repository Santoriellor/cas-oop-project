import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { CourseService, Enrollment, Certificate } from '../service/course.service';

/**
 * User dashboard component.
 *
 * <p>
 * This component displays personalized information for the
 * authenticated user, including:
 * </p>
 *
 * <ul>
 *   <li>The user's enrolled courses</li>
 *   <li>The user's earned certificates</li>
 * </ul>
 *
 * <p>
 * It retrieves all required data from the backend on initialization.
 * </p>
 */
@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {

  /**
   * Username of the currently authenticated user.
   */
  username = '';

  /**
   * List of courses the user is enrolled in.
   */
  enrollments: Enrollment[] = [];

  /**
   * List of certificates earned by the user.
   */
  certificates: Certificate[] = [];

  /**
   * Creates a new {@link UserDashboardComponent}.
   *
   * @param auth service used to retrieve the current user profile
   * @param courseService service used to load enrollments and certificates
   */
  constructor(private readonly auth: AuthService, private readonly courseService: CourseService) {}

  /**
   * Angular lifecycle hook invoked after component initialization.
   *
   * <p>
   * Loads:
   * </p>
   * <ul>
   *   <li>Authenticated user profile</li>
   *   <li>User enrollments</li>
   *   <li>User certificates</li>
   * </ul>
   */
  ngOnInit() {
    // Load current user profile
    this.auth.me().subscribe(user => {
      this.username = user.username;
    });

    // Load user's enrollments
    this.courseService.getMyEnrollments().subscribe(res => {
      this.enrollments = res;
    });

    // Load user's certificates
    this.courseService.getMyCertificates().subscribe(res => {
      this.certificates = res;
    });
  }

  /**
   * Downloads a certificate file for the given certificate ID.
   *
   * <p>
   * The certificate is downloaded as a PDF file
   * using a temporary object URL.
   * </p>
   *
   * @param id ID of the certificate to download
   */
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
