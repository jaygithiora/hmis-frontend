import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchemeExclusionsService {
constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) { }

  getSchemeExclusions(page: number = 1, search: string = "", payment_type: any = ""): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/dashboard/masters/insurances/schemes/exclusions?page=${page}&search=${search}&payment_type=${payment_type}`);
  }
  updateSchemeExclusion(inputData: any) {
    return this.http.post(`${this.baseUrl}/api/dashboard/masters/insurances/schemes/exclusions/add`, inputData);
  }
  deleteSchemeExclusion(inputData: any) {
    return this.http.post(`${this.baseUrl}/api/dashboard/masters/insurances/schemes/exclusions/delete`, inputData);
  }
}
