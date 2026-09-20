import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { LeaveRequest } from "../models/leave-request.model";
import { map, Observable } from "rxjs";
import { mapLeave } from "../mapper/mapper";

@Injectable({
    providedIn: 'root'
})

export class LeaveService {
    private baseUrl = `${environment.supabaseUrl}/rest/v1`;
    private http = inject(HttpClient);
    private headers = new HttpHeaders({
        'apikey': environment.supabaseKey,
        'Prefer': 'count=exact'
    });

    applyLeave(leaveData: Partial<LeaveRequest>): Observable<LeaveRequest> {
        return this.http.post<LeaveRequest>(
            `${this.baseUrl}/leave_requests`,
            leaveData,
            { headers: this.headers.set('Prefer', 'return=representation') }
        )
    }

    getMyLeaves(employeeId: string): Observable<LeaveRequest[]> {
        return this.http.get<LeaveRequest[]>(
            `${this.baseUrl}/leave_requests?employee_id=eq.${employeeId}&order=created_at.desc`,
            { headers: this.headers }
        ).pipe(
            map(response => response.map(mapLeave) ?? [])
        )
    }

    getAllLeaveRequests(): Observable<LeaveRequest[]> {
        return this.http.get<LeaveRequest[]>(
            `${this.baseUrl}/leave_requests?status=eq.pending&order=created_at.desc&select=*,employees!leave_requests_employee_id_fkey(full_name)`,
            { headers: this.headers }
        ).pipe(
            map(response => {
                return response.map(mapLeave) ?? []
            })
        )
    }

    getDepartmentLeaveRequests(departmentId: string): Observable<LeaveRequest[]> {
        return this.http.get<LeaveRequest[]>(
            `${this.baseUrl}/leave_requests?status=eq.pending&order=created_at.desc&select=*,employees(full_name,department_id)&employees.department_id=eq.${departmentId}`,
            { headers: this.headers }
        ).pipe(
            map(response => response.map(mapLeave) ?? [])
        )
    }

    updateLeaveStatus(leaveId: string, status: 'approved' | 'rejected', reviewedBy: string): Observable<LeaveRequest> {
        return this.http.patch<LeaveRequest>(
            `${this.baseUrl}/leave_requests?id=eq.${leaveId}`,
            { status, reviewed_by: reviewedBy },
            { headers: this.headers.set('Prefer', 'return=representation') }
        );
    }
}