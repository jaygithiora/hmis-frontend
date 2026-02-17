import {API_BASE_URL} from '@/tokens/api-base-url.token';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DepartmentsService {
    constructor(
        private http: HttpClient,
        @Inject(API_BASE_URL) private baseUrl: string
    ) {}

    getDepartments(page: number = 1, params?: HttpParams): Observable<any> {
        params = (params || new HttpParams()).set('page', page.toString());
        return this.http.get(
            `${this.baseUrl}/api/dashboard/masters/departments`,
            {params}
        );
    }
    updateDepartment(inputData: any) {
        return this.http.post(
            `${this.baseUrl}/api/dashboard/masters/departments/add`,
            inputData
        );
    }
    uploadDepartments(inputData: any) {
        return this.http.post(
            `${this.baseUrl}/api/dashboard/masters/departments/import`,
            inputData
        );
    }
}
