import { Employee } from "../models/employee.model";
import { LeaveRequest } from "../models/leave-request.model";

export function mapEmployee(data: any): Employee {
  return {
    id: data.id,
    fullName: data.full_name,
    email: data.email,
    role: data.role,
    departmentId: data.department_id,
    managerId: data.manager_id,
    jobTitle: data.job_title,
    joinedAt: data.joined_at,
    department: data.departments ?? null
  };
}

export function mapLeave(data: any): LeaveRequest {
  return {
    id: data.id,
    employeeId: data.employee_id,
    reviewedBy: data.reviewed_by,
    createdAt: data.created_at,
    startDate: data.start_date,
    endDate: data.end_date,
    reason: data.reason,
    status: data.status,
    employees: data.employees?.full_name ?? null
  };
}