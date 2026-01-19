import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, interval, Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

/**
 * Service for monitoring backend connection status.
 *
 * <p>
 * This service periodically checks the backend health endpoint
 * and exposes the current connection status as an observable.
 * </p>
 *
 * <p>
 * It is primarily used to provide real-time feedback in the UI
 * (e.g. online/offline indicators).
 * </p>
 */
@Injectable({
  providedIn: 'root'
})
export class ConnectionStatusService {

  /**
   * Base API URL of the backend.
   */
  private api = environment.apiUrl;

  /**
   * Internal subject holding the current connection status.
   *
   * <p>
   * {@code true} indicates that the backend is reachable,
   * {@code false} indicates that it is unreachable.
   * </p>
   */
  private connectionStatus$ = new BehaviorSubject<boolean>(true);

  /**
   * Creates a new {@link ConnectionStatusService}
   * and starts the health monitoring process.
   *
   * @param http Angular HTTP client used for health checks
   */
  constructor(private http: HttpClient) {
    this.startMonitoring();
  }

  /**
   * Starts periodic monitoring of the backend health endpoint.
   *
   * <p>
   * The backend is checked every 10 seconds.
   * The first check is triggered immediately on startup.
   * </p>
   */
  private startMonitoring() {
    interval(10000) // Check every 10 seconds
      .pipe(
        startWith(0), // Trigger an immediate initial check
        switchMap(() => this.checkHealth())
      )
      .subscribe(status => {
        this.connectionStatus$.next(status);
      });
  }

  /**
   * Performs a single health check request.
   *
   * <p>
   * The backend is considered reachable if the response
   * status code is {@code 200 OK}.
   * </p>
   *
   * @return an observable emitting {@code true} if reachable, otherwise {@code false}
   */
  private checkHealth(): Observable<boolean> {
    return this.http.get(`${this.api}/health`, { observe: 'response' }).pipe(
      map(res => res.status === 200),
      catchError(() => of(false))
    );
  }

  /**
   * Returns an observable of the current connection status.
   *
   * <p>
   * Components can subscribe to this observable to react
   * to backend connectivity changes in real time.
   * </p>
   *
   * @return observable emitting the current connection status
   */
  getStatus(): Observable<boolean> {
    return this.connectionStatus$.asObservable();
  }
}
