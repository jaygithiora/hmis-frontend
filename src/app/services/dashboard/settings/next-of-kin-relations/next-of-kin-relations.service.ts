import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NextOfKinRelationsService {
  constructor(private http: HttpClient,@Inject(API_BASE_URL) private baseUrl:string) { }

  getNextOfKinRelations(page:number = 1, search:string=""):Observable<any>{
    return this.http.get(`${this.baseUrl}/api/dashboard/settings/next_of_kin_relations?page=${page}&search=${search}`);
  }
  updateNextOfKinRelations(inputData:any){
    return this.http.post(`${this.baseUrl}/api/dashboard/settings/next_of_kin_relations/add`, inputData);
  }
}
