import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SickLeaveTypesService {

constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) { }

    getSickLeaveTypes(page: number = 1, search: string = ""): Observable<any> {
      return this.http.get(`${this.baseUrl}/api/dashboard/settings/sick-leave-types?page=${page}&search=${search}`);
    }

    updateSickLeaveType(inputData: any) {
      return this.http.post(`${this.baseUrl}/api/dashboard/settings/sick-leave-types/add`, inputData);
    }
    deleteSickLeaveType(inputData: any) {
      return this.http.post(`${this.baseUrl}/api/dashboard/settings/sick-leave-types/delete`, inputData);
    }
}
