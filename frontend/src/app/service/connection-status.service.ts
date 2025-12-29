import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, interval, Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConnectionStatusService {
  private api = environment.apiUrl;
  private connectionStatus$ = new BehaviorSubject<boolean>(true);

  constructor(private http: HttpClient) {
    this.startMonitoring();
  }

  private startMonitoring() {
    interval(10000) // Check every 10 seconds
      .pipe(
        startWith(0),
        switchMap(() => this.checkHealth())
      )
      .subscribe(status => {
        this.connectionStatus$.next(status);
      });
  }

  private checkHealth(): Observable<boolean> {
    return this.http.get(`${this.api}/health`, { observe: 'response' }).pipe(
      map(res => res.status === 200),
      catchError(() => of(false))
    );
  }

  getStatus(): Observable<boolean> {
    return this.connectionStatus$.asObservable();
  }
}
