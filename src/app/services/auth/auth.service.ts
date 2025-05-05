import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl:string, private router: Router) { }

  register(inputData: any) {
    return this.http.post(`${this.baseUrl}/api/register`, inputData);
  }

  login(inputData: any){
    return this.http.post(`${this.baseUrl}/api/login`, inputData);
  }
  isLoggedIn() :boolean{
    return localStorage.getItem('token') != null;
  }
  getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
  logout() {
    return this.http.post(`${this.baseUrl}/dashboard/logout`, '').subscribe((result: any) => {
      //console.log(result);
      localStorage.clear();
      this.router.navigateByUrl("/login");
    }, error => {
      //console.log(error);
      localStorage.clear();
      this.router.navigateByUrl("/login");
    });
  }
}
