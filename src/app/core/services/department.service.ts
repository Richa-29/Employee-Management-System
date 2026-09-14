import { Injectable, inject } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { Department } from "../models/department.model";

@Injectable({
    providedIn: 'root'
})

export class DepartmentService {
    private baseUrl = `${environment.supabaseUrl}/rest/v1`;
    private http = inject(HttpClient);
    private headers = new HttpHeaders({
        'apikey': environment.supabaseKey,
        'Prefer': 'count=exact'
    });

    getDepartments(): Observable<Department[]> {
        return this.http.get<Department[]>(`${this.baseUrl}/departments?select=*`, 
            {
                headers: this.headers,
            }).pipe(
                map(data=> data)
            );
    }   
   

}