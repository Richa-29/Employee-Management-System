export interface Employee {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  departmentId: string | null;
  managerId: string | null;
  jobTitle: string | null;
  joinedAt: string;
  department: { name: string } | null; // nested department
}