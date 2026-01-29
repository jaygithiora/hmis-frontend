import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LaboratoryWorkListService {

  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) { }

  getLaboratoryWorkList(page: number = 1, search: string = ""): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/dashboard/laboratory/work-list?page=${page}&search=${search}`);
  }

  getLaboratoryWorkListItem(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/dashboard/laboratory/work-list/view/${id}`);
  }

  updateLaboratoryResults(inputData: any) {
    return this.http.post(`${this.baseUrl}/api/dashboard/laboratory/work-list/add`, inputData);
  }
}
