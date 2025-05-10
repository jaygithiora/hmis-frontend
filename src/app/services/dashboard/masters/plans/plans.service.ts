import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlansService {
  constructor(private http: HttpClient,@Inject(API_BASE_URL) private baseUrl:string) { }

    getPlans(page:number = 1, search:string="", sub_type:number=0):Observable<any>{
      return this.http.get(`${this.baseUrl}/api/dashboard/masters/plans?page=${page}&search=${search}&sub_type=${sub_type}`);
    }
    updatePlan(inputData:any){
      return this.http.post(`${this.baseUrl}/api/dashboard/masters/plans/add`, inputData);
    }
}
