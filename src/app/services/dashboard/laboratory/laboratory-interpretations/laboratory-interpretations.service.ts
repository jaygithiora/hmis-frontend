import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class LaboratoryInterpretationsService {

  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) { }

  getLaboratoryInterpretations(page: number = 1, search: string = ""): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/dashboard/laboratory/interpretations?page=${page}&search=${search}`);
  }

  updateLaboratoryInterpretation(inputData: any) {
    return this.http.post(`${this.baseUrl}/api/dashboard/laboratory/interpretations/add`, inputData);
  }

  getLaboratoryInterpretation(id: any) {
    return this.http.get(`${this.baseUrl}/api/dashboard/laboratory/interpretations/view/${id}`);
  }
}
