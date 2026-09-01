export interface Employee {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  department_id: string | null;
  manager_id: string | null;
  job_title: string | null;
  joined_at: string;
  departments: { name: string } | null; // nested department
}