import { API_BASE_URL } from '@/tokens/api-base-url.token';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl:string) { }

  getLocations(page:number = 1, search:string=""){
    return this.http.get(`${this.baseUrl}/api/dashboard/masters/locations?page=${page}`);
  }

  addLocation(inputData:any){
    return this.http.post(`${this.baseUrl}/api/dashboard/masters/locations/add`, inputData);
  }
}
