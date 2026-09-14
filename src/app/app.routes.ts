import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { EmployeeListComponent } from './features/employee-list/employee-list.component';
import { authGuard } from './core/guards/auth.guard';
import { ShellComponent } from './shared/layout/shell/shell.component';
import { EmployeeDetailComponent } from './features/employee-detail/employee-detail.component';
import { AddEditEmployeeComponent } from './features/add-edit-employee/add-edit-employee.component';

export const routes: Routes = [
   { path: '', component: LoginComponent },
   { path: 'shell', 
     component: ShellComponent, 
     canActivate: [authGuard],
     children: [
      { path: 'dashboard', component: DashboardComponent},
      { path: 'employees', component: EmployeeListComponent },
      { path: 'employees/add', component: AddEditEmployeeComponent},
      { path: 'employees/:id', component: EmployeeDetailComponent },
      { path: 'employees/:id/edit', component: AddEditEmployeeComponent},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
     ]
   },
   { path: '**', redirectTo: '' }
];
