import { Injectable, inject, signal } from "@angular/core";
import { Employee } from '../models/employee.model';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class EmployeeService {
    private baseUrl = `${environment.supabaseUrl}/rest/v1`;
    private http = inject(HttpClient);
    private headers = new HttpHeaders({
        'apikey': environment.supabaseKey,
        'Prefer': 'count=exact'
    });

    getEmployees(page: number, pageSize: number): Observable<{data: Employee[], count: number}> {
        const from = (page-1)*pageSize;
        const to = (from+pageSize)-1;
        return this.http.get<Employee[]>(`${this.baseUrl}/employees?select=*,departments(name)`, 
            {
                headers: this.headers.set('Range', `${from}-${to}`),
                observe: 'response'
            }).pipe(map(response=>({
                data: response.body ?? [],
                count: parseInt(response.headers.get('content-range')?.split('/')[1] ?? '0')
            })));
    }

   

}