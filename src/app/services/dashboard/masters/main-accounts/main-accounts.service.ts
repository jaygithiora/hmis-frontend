import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainAccountsService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) { }

  getMainAccounts(page: number = 1, search: string = ""): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/dashboard/masters/main-accounts?page=${page}&search=${search}`);
  }

  updateMainAccount(inputData: any) {
    return this.http.post(`${this.baseUrl}/api/dashboard/masters/main-accounts/add`, inputData);
  }
}
