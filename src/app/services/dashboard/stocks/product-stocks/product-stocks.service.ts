import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductStocksService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) { }

  getStocks(page: number = 1, search: string = "", department:number=0): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/dashboard/stocks?page=${page}&search=${search}&department=${department}`);
  }
  updateStock(inputData: any) {
    return this.http.post(`${this.baseUrl}/api/dashboard/stocks/add`, inputData);
  }

  getPrescriptionStocks(page: number = 1, search: string = "", scheme:string="", store:string="", organization:string="", branch:string=""){
    return this.http.get(`${this.baseUrl}/api/dashboard/stocks/prescriptions?page=${page}&search=${search}&scheme=${scheme}&store=${store}&organization=${organization}&branch=${branch}`);
  }
}
