# Employee Management System (EMS)

A full-featured HR management application built with **Angular 22** and **Supabase**, designed to showcase modern Angular development practices including signals, standalone components, reactive forms, role-based access control, and real-time data.

---

## 🔗 Live Demo

https://employee-management-system-skgm.vercel.app/

---

## 🧪 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | testadmin@example.com | Password123! |
| Manager | employee1@testcompany.com | Password123! |
| Employee | employee9@testcompany.com | Password123! |

> Each role has different access levels — try logging in with each to see role-based UI in action.

---

## ✨ Features

### Authentication
- JWT-based authentication via Supabase Auth
- Session persistence with automatic token refresh
- Auth guard with race condition handling (`isInitialized` signal)
- HTTP interceptor for automatic token attachment

### Role-Based Access Control
- Three roles: **Admin**, **Manager**, **Employee**
- Role guard (factory pattern) protecting routes
- Role-based sidebar navigation
- Role-based dashboard content

### Employee Management (Admin only)
- Server-side pagination (10 records per page)
- Real-time search with `debounceTime` + `distinctUntilChanged` + `switchMap`
- Client-side sorting by name, email, role, department
- Add employee via Supabase Edge Function (creates auth user + employee record)
- Edit and delete employee
- Employee detail page

### Leave Management
- Employee: Apply for leave, view own leave history with status badges
- Manager: View and approve/reject department leaves
- Admin: View and approve/reject all leaves
- Angular Material datepicker

### Dashboard
- **Admin**: Stats cards (total employees, departments, pending leaves, managers) + Chart.js charts (employees by department, by role, leave trends by month)
- **Manager**: Team headcount + pending leave requests
- **Employee**: Personal leave stats (pending/approved/rejected)
- Independent API calls per chart — one chart failing doesn't break others

### Departments
- Admin-only CRUD
- Add and delete departments

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 22 (Standalone, Signals, Zoneless) |
| Backend | Supabase (PostgreSQL + Auth + Edge Functions) |
| Charts | ng2-charts + Chart.js |
| UI | Custom SCSS + Angular Material (datepicker) |
| Deployment | Vercel |

---

## 🏗️ Architecture Highlights

### Angular Signals
State management using Angular's built-in signals - no NgRx needed.
```typescript
employees = signal<Employee[]>([]);
isLoading = signal(true);
totalPages = computed(() => Math.ceil(this.totalCount() / this.pageSize()));
```

### Smart Container + Dumb Components
Dashboard uses container pattern, each chart is an independent component with its own API call and error state.

### RxJS Patterns Used
- `debounceTime` + `distinctUntilChanged` + `switchMap` for search
- `takeUntilDestroyed` for automatic subscription cleanup
- `HttpClient` with `observe: 'response'` for pagination headers

### Auth Guard with Race Condition Fix
```typescript
return toObservable(authService.isInitialized).pipe(
  filter(initialized => initialized === true),
  switchMap(() => {
    if (authService.isAuthenticated()) return of(true);
    router.navigate(['/login']);
    return of(false);
  })
);
```

### Role Guard Factory Pattern
```typescript
export const roleGuard = (allowedRoles: string[]) => {
  return (): boolean => {
    const role = inject(AuthService).role();
    if (role && allowedRoles.includes(role)) return true;
    inject(Router).navigate(['/shell/dashboard']);
    return false;
  };
};
```

### Mapper Pattern (camelCase ↔ snake_case)
```typescript
export function mapEmployee(data: any): Employee {
  return {
    id: data.id,
    fullName: data.full_name,
    departmentId: data.department_id,
    // ...
  };
}
```

---

## 📁 Project Structure

```
src/app/
├── core/
│   ├── guards/          # auth.guard, role.guard
│   ├── interceptors/    # auth.interceptor
│   ├── mappers/         # employee.mapper, leave.mapper
│   ├── models/          # TypeScript interfaces
│   └── services/        # auth, employee, leave, department, dashboard
├── features/
│   ├── auth/            # login
│   ├── dashboard/       # dashboard + sub-components (charts, stats)
│   ├── employees/       # list, detail, add-edit
│   ├── leaves/          # apply, approvals
│   └── departments/     # list
└── shared/
    └── layout/          # navbar, sidebar, shell
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Angular CLI 22+

### Installation

```bash
git clone https://github.com/Richa-29/employee-management-system.git
cd employee-management-system
npm install
```

### Environment Setup

Copy the example environment file:
```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

Fill in your Supabase credentials in `environment.ts`:
```typescript
export const environment = {
  production: false,
  supabaseUrl: 'YOUR_SUPABASE_URL',
  supabaseKey: 'YOUR_SUPABASE_PUBLISHABLE_KEY',
  createEmployeeFn: 'YOUR_SUPABASE_URL/functions/v1/create-employee'
};
```

### Run locally

```bash
ng serve
```

Open [http://localhost:4200](http://localhost:4200)

---

## 🔐 Security Notes

- Publishable (anon) key is used on the frontend - safe to expose
- Row Level Security (RLS) policies enforce data access at database level
- Admin operations (creating auth users) handled via Supabase Edge Function using service role key - never exposed to frontend
- Role stored in `employees` table, verified server-side via RLS

---

## 📊 Database Schema

```sql
departments (id, name, created_at)

employees (
  id → references auth.users(id),
  full_name, email, role,
  department_id → references departments(id),
  manager_id → references employees(id),
  job_title, joined_at, created_at
)

leave_requests (
  id, employee_id, start_date, end_date,
  reason, status (pending/approved/rejected),
  reviewed_by, created_at
)
```

---

## 👩‍💻 Author

Built by **Richa Singhal** - Senior Angular Developer

[GitHub](https://github.com/Richa-29) • [LinkedIn](www.linkedin.com/in/richa-singhal-021542bb)
