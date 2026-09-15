import { Employee } from "../models/employee.model";

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