import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoresService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) { }

  getStores(page: number = 1, search: string = "", organization:string="", branch:string=""): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/dashboard/masters/stores?page=${page}&search=${search}&organization=${organization}&branch=${branch}`);
  }
  updateStore(inputData: any) {
    return this.http.post(`${this.baseUrl}/api/dashboard/masters/stores/add`, inputData);
  }
}
