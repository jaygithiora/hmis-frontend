import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorsService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) { }

  getDoctors(page: number = 1, search: string = "", department:number=0): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/dashboard/masters/doctors?page=${page}&search=${search}&department=${department}`);
  }
  updateDoctor(inputData: any) {
    return this.http.post(`${this.baseUrl}/api/dashboard/masters/doctors/add`, inputData);
  }
}
