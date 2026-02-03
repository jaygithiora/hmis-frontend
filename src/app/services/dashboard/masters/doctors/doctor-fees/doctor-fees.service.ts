import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorFeesService {

  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) { }

  getDoctorFees(page: number = 1, search: string = "", insurance: any = ""): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/dashboard/masters/doctors/fees?page=${page}&search=${search}&insurance=${insurance}`);
  }
  updateDoctorFee(inputData: any) {
    return this.http.post(`${this.baseUrl}/api/dashboard/masters/doctors/fees/add`, inputData);
  }
}
