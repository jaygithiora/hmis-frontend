import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubTypesService {

   constructor(private http: HttpClient,@Inject(API_BASE_URL) private baseUrl:string) { }

      getSubTypes(page:number = 1, search:string="", main_type:number=0):Observable<any>{
        return this.http.get(`${this.baseUrl}/api/dashboard/masters/sub-types?page=${page}&search=${search}&main_type=${main_type}`);
      }

      updateSubTypes(inputData:any){
        return this.http.post(`${this.baseUrl}/api/dashboard/masters/sub-types/add`, inputData);
      }
}
