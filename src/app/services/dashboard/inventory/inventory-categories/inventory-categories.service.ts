import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryCategoriesService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) { }
  
    getInventoryCategories(page: number = 1, search: string = ""): Observable<any> {
      return this.http.get(`${this.baseUrl}/api/dashboard/inventory/categories?page=${page}&search=${search}`);
    }
  
    updateInventoryCategories(inputData: any) {
      return this.http.post(`${this.baseUrl}/api/dashboard/inventory/categories/add`, inputData);
    }
}
