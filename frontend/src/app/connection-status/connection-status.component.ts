import { Component } from '@angular/core';
import { ConnectionStatusService } from '../service/connection-status.service';
import { CommonModule } from '@angular/common';

/**
 * Connection status indicator component.
 *
 * <p>
 * This standalone component displays the current connectivity status
 * of the backend. It subscribes to an observable provided by
 * {@link ConnectionStatusService} and reflects the state in the UI.
 * </p>
 *
 * <p>
 * The component is intentionally kept lightweight and stateless,
 * delegating all connection logic to the service layer.
 * </p>
 */
@Component({
  selector: 'app-connection-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './connection-status.component.html',
  styleUrls: ['./connection-status.component.scss']
})
export class ConnectionStatusComponent {

  /**
   * Observable representing the current backend connection status.
   *
   * <p>
   * Emits {@code true} when the backend is reachable and {@code false}
   * when the connection is unavailable.
   * </p>
   */
  isConnected$ = this.connectionStatusService.getStatus();

  /**
   * Creates a new {@link ConnectionStatusComponent}.
   *
   * @param connectionStatusService service responsible for monitoring backend connectivity
   */
  constructor(private connectionStatusService: ConnectionStatusService) {}
}
