import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.supabaseUrl}/rest/v1`;
  private headers = new HttpHeaders({
    'apikey': environment.supabaseKey,
    'Prefer': 'count=exact'
  });

    getTotalEmployees(): Observable<number> {
        return this.http.get<any[]>(
            `${this.baseUrl}/employees?select=id`,
            { headers: this.headers, observe: 'response' }
        ).pipe(map(r => parseInt(r.headers.get('content-range')?.split('/')[1] ?? '0')));
    }

    getTotalDepartments(): Observable<number> {
    return this.http.get<any[]>(
        `${this.baseUrl}/departments?select=id`,
        { headers: this.headers, observe: 'response' }
    ).pipe(map(r => parseInt(r.headers.get('content-range')?.split('/')[1] ?? '0')));
    }

    getPendingLeaves(): Observable<number> {
    return this.http.get<any[]>(
        `${this.baseUrl}/leave_requests?status=eq.pending&select=id`,
        { headers: this.headers, observe: 'response' }
    ).pipe(map(r => parseInt(r.headers.get('content-range')?.split('/')[1] ?? '0')));
    }

    getEmployeesByDepartment(): Observable<any[]> {
    return this.http.get<any[]>(
        `${this.baseUrl}/employees?select=department_id,departments(name)`,
        { headers: new HttpHeaders({ 'apikey': environment.supabaseKey }) }
    );
    }

    getEmployeesByRole(): Observable<any[]> {
    return this.http.get<any[]>(
        `${this.baseUrl}/employees?select=role`,
        { headers: new HttpHeaders({ 'apikey': environment.supabaseKey }) }
    );
    }

    getLeavesByMonth(): Observable<any[]> {
    return this.http.get<any[]>(
        `${this.baseUrl}/leave_requests?select=created_at&order=created_at.asc`,
        { headers: new HttpHeaders({ 'apikey': environment.supabaseKey }) }
    );
    }

    getTotalManagers(): Observable<number> {
        return this.http.get<any[]>(
            `${this.baseUrl}/employees?role=eq.manager&select=id`,
            { headers: this.headers, observe: 'response' }
        ).pipe(map(r => parseInt(r.headers.get('content-range')?.split('/')[1] ?? '0')));
    }
}