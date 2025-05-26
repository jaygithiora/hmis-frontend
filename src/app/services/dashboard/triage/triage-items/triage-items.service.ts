import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TriageItemsService {
  constructor(private http: HttpClient,@Inject(API_BASE_URL) private baseUrl:string) { }
    getTriageItems(page:number = 1, search:string=""):Observable<any>{
      return this.http.get(`${this.baseUrl}/api/dashboard/triage/items?page=${page}&search=${search}`);
    }
    getTriageItemsWithOperations(page:number = 1, search:string=""):Observable<any>{
      return this.http.get(`${this.baseUrl}/api/dashboard/triage/items/with_operations?page=${page}&search=${search}`);
    }
    updateTriageItem(inputData:any){
      return this.http.post(`${this.baseUrl}/api/dashboard/triage/items/add`, inputData);
    }
    getTriageItem(id:number):Observable<any>{
      return this.http.get(`${this.baseUrl}/api/dashboard/triage/items/view/${id}`);
    }
    getTriageItemInterpretations(page:number = 1, id:number):Observable<any>{
      return this.http.get(`${this.baseUrl}/api/dashboard/triage/items/interpretations/${id}?page=${page}`);
    }
    updateTriageItemInterpretation(inputData:any){
      return this.http.post(`${this.baseUrl}/api/dashboard/triage/items/interpretations/add`, inputData);
    }
    getTriageItemChoices(page:number = 1, id:number):Observable<any>{
      return this.http.get(`${this.baseUrl}/api/dashboard/triage/items/choices/${id}?page=${page}`);
    }
    updateTriageItemChoice(inputData:any){
      return this.http.post(`${this.baseUrl}/api/dashboard/triage/items/choices/add`, inputData);
    }
    getTriageItemOperations(id:number):Observable<any>{
      return this.http.get(`${this.baseUrl}/api/dashboard/triage/items/operations/${id}`);
    }
    updateTriageItemOperation(inputData:any){
      return this.http.post(`${this.baseUrl}/api/dashboard/triage/items/operations/add`, inputData);
    }
    updateTriageItemOperationItem(inputData:any){
      return this.http.post(`${this.baseUrl}/api/dashboard/triage/items/operations/items/add`, inputData);
    }
}
