import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OutpatientVisitsService {

  constructor(private http: HttpClient,@Inject(API_BASE_URL) private baseUrl:string) { }

    getOutpatientVisits(page:number = 1, search:string=""):Observable<any>{
      return this.http.get(`${this.baseUrl}/api/dashboard/outpatients/visits?page=${page}&search=${search}`);
    }
    updateOutpatientVisit(inputData:any){
      return this.http.post(`${this.baseUrl}/api/dashboard/outpatients/visits/add`, inputData);
    }
    getOutpatientVisit(id:number){
      return this.http.get(`${this.baseUrl}/api/dashboard/patients/registrations/view/${id}`);
    }
}
