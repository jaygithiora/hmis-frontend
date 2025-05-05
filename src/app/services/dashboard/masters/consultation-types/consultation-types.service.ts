import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsultationTypesService {

  
    constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl:string) { }
  
    getConsultationTypes(page:number = 1, search:string=""){
      return this.http.get(`${this.baseUrl}/api/dashboard/masters/consultation-types?page=${page}`);
    }
  
    updateConsultationType(inputData:any){
      return this.http.post(`${this.baseUrl}/api/dashboard/masters/consultation-types/add`, inputData);
    }
  
}
