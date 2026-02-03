import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LaboratoryResultsMasterDataService {
constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) { }

  getLaboratoryResultsMasterData(page: number = 1, search: string = ""): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/dashboard/laboratory/results-master-data?page=${page}&search=${search}`);
  }

  downloadAllPdf(billId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/api/dashboard/laboratory/results-master-data/${billId}/pdf/download/all`, {
      responseType: 'blob'
    });
  }

  downloadPdf(billId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/api/dashboard/laboratory/results-master-data/${billId}/pdf/download`, {
      responseType: 'blob'
    });
  }

  streamAllPdf(billId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/api/dashboard/laboratory/results-master-data/${billId}/pdf/stream/all`, {
      responseType: 'blob'
    });
  }

  streamPdf(billId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/api/dashboard/laboratory/results-master-data/${billId}/pdf/stream`, {
      responseType: 'blob'
    });
  }
}
