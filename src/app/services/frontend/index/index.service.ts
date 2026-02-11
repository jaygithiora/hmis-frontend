import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndexService {

constructor(private http: HttpClient,@Inject(API_BASE_URL) private baseUrl:string) { }
  getSubscriptionPackages(page:number = 1, search:string=""):Observable<any>{
    return this.http.get(`${this.baseUrl}/api/subscriptions/packages?page=${page}&search=${search}`);
  }
  getBill(id:number):Observable<any>{
    return  this.http.get(`${this.baseUrl}/api/dashboard/bills/view/${id}`);
  }
  updateBill(inputData:any){
    return this.http.post(`${this.baseUrl}/api/dashboard/bills/update`, inputData);
  }
  getDiscountBills(page:number = 1, search:string=""):Observable<any>{
    return this.http.get(`${this.baseUrl}/api/dashboard/bills/discounts?page=${page}&search=${search}`);
  }
  getDiscountBill(id:number):Observable<any>{
    return  this.http.get(`${this.baseUrl}/api/dashboard/bills/discounts/view/${id}`);
  }
  updateDiscountBill(inputData:any){
    return this.http.post(`${this.baseUrl}/api/dashboard/bills/discounts/update`, inputData);
  }
  
  downloadPdf(billId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/api/dashboard/bills/${billId}/pdf/download`, {
      responseType: 'blob'
    });
  }

  streamPdf(billId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/api/dashboard/bills/${billId}/pdf/stream`, {
      responseType: 'blob'
    });
  }
}
