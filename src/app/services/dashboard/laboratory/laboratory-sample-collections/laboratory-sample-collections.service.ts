import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LaboratorySampleCollectionsService {

  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) { }

  getLaboratorySampleCollections(page: number = 1, search: string = ""): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/dashboard/laboratory/sample-collections?page=${page}&search=${search}`);
  }

  getLaboratorySampleCollection(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/dashboard/laboratory/sample-collections/view/${id}`);
  }

  updateSampleCollection(inputData: any) {
    return this.http.post(`${this.baseUrl}/api/dashboard/laboratory/sample-collections/add`, inputData);
  }
}
