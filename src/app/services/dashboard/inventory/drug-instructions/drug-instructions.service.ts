import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrugInstructionsService {
constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) { }
  getDrugInstructions(page: number = 1, search: string = ""): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/dashboard/inventory/drug-instructions?page=${page}&search=${search}`);
  }

  updateDrugInstructions(inputData: any) {
    return this.http.post(`${this.baseUrl}/api/dashboard/inventory/drug-instructions/add`, inputData);
  }
}
