import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocialHistoriesService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) { }

  getSocialHistories(page: number = 1, search: string = ""): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/dashboard/settings/social-histories?page=${page}&search=${search}`);
  }

  updateSocialHistory(inputData: any) {
    return this.http.post(`${this.baseUrl}/api/dashboard/settings/social-histories/add`, inputData);
  }
}
