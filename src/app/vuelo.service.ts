import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackService {
  private baseUrl = 'http://localhost:3000'; // Cambia la URL base según tu configuración

  constructor(private http: HttpClient) { }

  get(url:string): Observable<any> {
    const data = this.baseUrl+url;
    return this.http.get(data);
  }

  post(url:string,json: any){
    const data = this.baseUrl+url;
    return this.http.post<any>(data, json);
  }
}
