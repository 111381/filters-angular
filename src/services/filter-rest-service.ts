import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Filter } from "../models/filter.model";
import { environment } from "@/environment";

@Injectable({
  providedIn: 'root'
})
export class FilterRestService {
  apiUrl: string = environment.apiUrl;
  filterServicePath: string = environment.filterServicePath;

  constructor(private http: HttpClient) {
  }

  getAllFilters(): Observable<Filter[]> {
    return this.http.get<Filter[]>(this.apiUrl + this.filterServicePath).pipe(
      catchError(error => {
        console.error('Failed to fetch filters:', error);
        return throwError(() => new Error('Failed to load filters. Please try again.'));
      })
    );
  }

  saveFilter(filter: Filter): Observable<Filter> {
    return this.http.post<Filter>(this.apiUrl + this.filterServicePath, filter).pipe(
      catchError(error => {
        console.error('Failed to save filter:', error);
        return throwError(() => new Error('Failed to save filter. Please try again.'));
      })
    );
  }
}
