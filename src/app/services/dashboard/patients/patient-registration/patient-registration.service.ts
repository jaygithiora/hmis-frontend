import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientRegistrationService {
constructor(private http: HttpClient,@Inject(API_BASE_URL) private baseUrl:string) { }

  getPatientRegistrations(page:number = 1, search:string=""):Observable<any>{
    return this.http.get(`${this.baseUrl}/api/dashboard/patients/registrations?page=${page}&search=${search}`);
  }
  updatePatientRegistration(inputData:any){
    return this.http.post(`${this.baseUrl}/api/dashboard/patients/registrations/add`, inputData);
  }
  getPatientRegistration(id:number){
    return this.http.get(`${this.baseUrl}/api/dashboard/patients/registrations/view/${id}`);
  }
}
