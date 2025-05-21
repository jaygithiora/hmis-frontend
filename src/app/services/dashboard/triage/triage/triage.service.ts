import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TriageService {

constructor(private http: HttpClient,@Inject(API_BASE_URL) private baseUrl:string) { }

  getTriageList(page:number = 1, search:string=""):Observable<any>{
    return this.http.get(`${this.baseUrl}/api/dashboard/triage/list?page=${page}&search=${search}`);
  }
  getTriage(id:number):Observable<any>{
    return this.http.get(`${this.baseUrl}/api/dashboard/triage/view/${id}`);
  }
  updateTriage(inputData:any){
    return this.http.post(`${this.baseUrl}/api/dashboard/triage/categories/add`, inputData);
  }
  getAllTriageItems():Observable<any>{
    return this.http.get(`${this.baseUrl}/api/dashboard/triage/items/all`);
  }
}
