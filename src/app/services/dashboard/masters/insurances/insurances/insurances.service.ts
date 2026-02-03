import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InsurancesService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) { }

  getInsurances(page: number = 1, search: string = "", payment_type: any = ""): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/dashboard/masters/insurances?page=${page}&search=${search}&payment_type=${payment_type}`);
  }
  updateInsurance(inputData: any) {
    return this.http.post(`${this.baseUrl}/api/dashboard/masters/insurances/add`, inputData);
  }
}
