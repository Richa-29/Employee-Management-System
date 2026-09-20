import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/department.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.supabaseUrl}/rest/v1`;
  private headers = new HttpHeaders({
    'apikey': environment.supabaseKey,
    'Prefer': 'return=representation'
  });

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(
      `${this.baseUrl}/departments?select=*&order=name.asc`,
      { headers: this.headers }
    );
  }

  addDepartment(name: string): Observable<Department> {
    return this.http.post<Department>(
      `${this.baseUrl}/departments`,
      { name },
      { headers: this.headers }
    );
  }

  deleteDepartment(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/departments?id=eq.${id}`,
      { headers: this.headers }
    );
  }
}