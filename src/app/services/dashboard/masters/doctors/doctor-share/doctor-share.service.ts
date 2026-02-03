import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorShareService {

  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) { }

  getDoctorShares(page: number = 1, search: string = "", insurance: any = ""): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/dashboard/masters/doctors/share?page=${page}&search=${search}&insurance=${insurance}`);
  }
  updateDoctorShare(inputData: any) {
    return this.http.post(`${this.baseUrl}/api/dashboard/masters/doctors/share/add`, inputData);
  }
}
