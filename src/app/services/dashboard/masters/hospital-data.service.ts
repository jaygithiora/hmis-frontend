import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HospitalDataService {

  constructor(private http: HttpClient,@Inject(API_BASE_URL) private baseUrl:string) { }

  getHospitalData():Observable<any>{
    return this.http.get(`${this.baseUrl}/api/dashboard/masters/hospital-data`);
  }
  updateHospitalData(inputData:any){
    return this.http.post(`${this.baseUrl}/api/dashboard/masters/hospital-data/add`, inputData);
  }
}
