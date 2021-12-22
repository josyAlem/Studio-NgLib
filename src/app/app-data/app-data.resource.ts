import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppDataResource {
  private apiRoot: string = ""; //"http://localhost:3000/contacts";
  constructor(private http: HttpClient) { }


  query(params: { [key: string]: string }): Observable<any[]> {
    return this.http.get<any[]>(this.apiRoot, { params });
  }

  get(id: any, params?: { [key: string]: string }): Observable<any> {
    return this.http.get<any>(this.apiRoot + '/' + id, { params });
  }

  getAll(apiroot: string): Observable<any> {
    return this.http.get<any>(apiroot);
  }

  save(data: any) {
    return this.http.post(this.apiRoot, data);
  }

  update(data: any) {
    return this.http.put(this.apiRoot + '/' + data.id, data);
  }

  remove(data: any) {
    return this.http.delete(this.apiRoot + '/' + data.id);
  }
}
