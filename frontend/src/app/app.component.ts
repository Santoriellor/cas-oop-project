import { Component } from '@angular/core';

/**
 * Root application component.
 *
 * <p>
 * This component acts as the entry point of the Angular application.
 * It does not contain business logic and primarily serves as a
 * container for the router outlet defined in the template.
 * </p>
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // Intentionally left empty.
  // All application logic is handled by routed components and services.
}
