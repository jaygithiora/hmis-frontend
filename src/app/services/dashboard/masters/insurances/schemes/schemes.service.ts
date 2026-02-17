import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchemesService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) { }

  getSchemes(page: number = 1, search: string = "", insurance: any = "", payment_type:any=""): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/dashboard/masters/insurances/schemes?page=${page}&search=${search}&insurance=${insurance}&payment_type=${payment_type}`);
  }
  updateScheme(inputData: any) {
    return this.http.post(`${this.baseUrl}/api/dashboard/masters/insurances/schemes/add`, inputData);
  }
}
