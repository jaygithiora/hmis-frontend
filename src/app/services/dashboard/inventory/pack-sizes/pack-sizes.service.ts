import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PackSizesService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) { }
  getPackSizes(page: number = 1, search: string = ""): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/dashboard/inventory/pack-sizes?page=${page}&search=${search}`);
  }

  updatePackSize(inputData: any) {
    return this.http.post(`${this.baseUrl}/api/dashboard/inventory/pack-sizes/add`, inputData);
  }
}
