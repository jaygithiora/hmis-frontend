import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizationsService {


constructor(private http: HttpClient,@Inject(API_BASE_URL) private baseUrl:string) { }
  getOrganizations(page:number = 1, search:string=""):Observable<any>{
    return this.http.get(`${this.baseUrl}/api/dashboard/organizations?page=${page}&search=${search}`);
  }
  addOrganization(inputData:any){
    return this.http.post(`${this.baseUrl}/api/dashboard/organizations/add`, inputData);
  }
  getOrganization(id:any){
    return this.http.get(`${this.baseUrl}/api/dashboard/organizations/view/${id}`);
  }
  getBranches(page:number = 1, search:string="", organization_id:any=''):Observable<any>{
    return this.http.get(`${this.baseUrl}/api/dashboard/organizations/branches?page=${page}&search=${search}&organization=${organization_id}`);
  }
  addBranch(inputData:any){
    return this.http.post(`${this.baseUrl}/api/dashboard/organizations/branches/add`, inputData);
  }
  getBranch(id:any){
    return this.http.get(`${this.baseUrl}/api/dashboard/organizations/branches/view/${id}`);
  }
}
