import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) { }
    getConsultations(page: number = 1, search: string = ""): Observable<any> {
      return this.http.get(`${this.baseUrl}/api/dashboard/consultations/list?page=${page}&search=${search}`);
    }
    getConsultation(id: number = 1): Observable<any> {
      return this.http.get(`${this.baseUrl}/api/dashboard/consultations/view/${id}`);
    }

    updateConsultation(inputData: any) {
      return this.http.post(`${this.baseUrl}/api/dashboard/inventory/dose-measures/add`, inputData);
    }
}
