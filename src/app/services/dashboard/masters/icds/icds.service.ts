import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IcdsService {
  constructor(private http: HttpClient,@Inject(API_BASE_URL) private baseUrl:string) { }
  
    getICDs(page:number = 1):Observable<any>{
      return this.http.get(`${this.baseUrl}/api/dashboard/masters/icds?page=${page}`);
    }
    updateICD(inputData:any){
      return this.http.post(`${this.baseUrl}/api/dashboard/masters/icds/add`, inputData);
    }
}
