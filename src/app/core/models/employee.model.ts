export interface Employee {
    id: number | null;
    full_name: string | null;
    email: string | null;
    role: 'admin' | 'manager' | 'employee';
    department_id: string | null;
    manager_id: string | null;
    job_title: string | null;
    joined_at: string | null;
}