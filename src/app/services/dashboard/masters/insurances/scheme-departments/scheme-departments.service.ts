import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchemeDepartmentsService {
constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) { }

  getSchemeDepartments(page: number = 1, scheme: any = "",search: string = "", payment_type: any = ""): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/dashboard/masters/insurances/schemes/departments?page=${page}&search=${search}&payment_type=${payment_type}&scheme=${scheme}`);
  }
  updateSchemeDepartment(inputData: any) {
    return this.http.post(`${this.baseUrl}/api/dashboard/masters/insurances/schemes/departments/add`, inputData);
  }
}
