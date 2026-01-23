import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) { }
  getRoles(page: number = 1, search: string = ""): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/dashboard/roles?page=${page}&search=${search}`);
  }
  updateRole(inputData: any) {
    return this.http.post(`${this.baseUrl}/api/dashboard/roles/add`, inputData);
  }
  getRole(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/dashboard/roles/view/${id}`);
  }
  saveRolePermissions(inputData: any) {
    return this.http.post(`${this.baseUrl}/api/dashboard/roles/permissions/save`, inputData);
  }
}
