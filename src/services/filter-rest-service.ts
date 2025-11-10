import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Filter } from "../models/filter.model";
import { environment } from "@/environment";
import { NotificationService } from "@/src/services/notification.service";

@Injectable({
  providedIn: 'root'
})
export class FilterRestService {
  apiUrl: string = environment.apiUrl;
  filterServicePath: string = environment.filterServicePath;
  baseHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  private readonly notificationService = inject(NotificationService);
  private readonly http = inject(HttpClient);

  getAllFilters(): Observable<Filter[]> {
    return this.http.get<Filter[]>(this.apiUrl + '/' + this.filterServicePath, {headers: this.baseHeaders}).pipe(
      catchError(error => {
        this.notificationService.error('Failed to fetch filters:' + error);
        return throwError(() => new Error('Failed to load filters. Please try again.'));
      })
    );
  }

  saveFilter(filter: Filter): Observable<Filter> {
    return this.http.post<Filter>(this.apiUrl + '/' + this.filterServicePath, filter, {headers: this.baseHeaders}).pipe(
      catchError(error => {
        this.notificationService.error('Failed to save filter:' + error);
        return throwError(() => new Error('Failed to save filter. Please try again.'));
      })
    );
  }
}
