import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PackagesService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) { }
  getSubscriptionPackages(page: number = 1, search: string = ""): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/dashboard/subscriptions/packages?page=${page}&search=${search}`);
  }
  getSubscriptionPackagePermissions(page: number = 1, search: string = "", id:number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/dashboard/subscriptions/packages/permissions/${id}?page=${page}&search=${search}`);
  }
  getSubscriptionPackage(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/dashboard/subscriptions/packages/view/${id}`);
  }
  updateSubscriptionPackage(inputData: any) {
    return this.http.post(`${this.baseUrl}/api/dashboard/subscriptions/packages/add`, inputData);
  }
}
