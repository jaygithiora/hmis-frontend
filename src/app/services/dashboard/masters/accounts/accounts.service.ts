import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) { }

    getAccounts(page: number = 1, search: string = "", sub_type:number=0): Observable<any> {
      return this.http.get(`${this.baseUrl}/api/dashboard/masters/accounts?page=${page}&search=${search}&sub_type=${sub_type}`);
    }

    updateAccount(inputData: any) {
      return this.http.post(`${this.baseUrl}/api/dashboard/masters/accounts/add`, inputData);
    }
}
