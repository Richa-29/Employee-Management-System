import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { EmployeeListComponent } from './features/employees/employee-list.component';
import { authGuard } from './core/guards/auth.guard';
import { ShellComponent } from './shared/layout/shell/shell.component';

export const routes: Routes = [
   { path: '', component: LoginComponent },
   { path: 'shell', 
     component: ShellComponent, 
     canActivate: [authGuard],
     children: [
      { path: 'dashboard', component: DashboardComponent},
      { path: 'employees', component: EmployeeListComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
     ]
   },
   { path: '**', redirectTo: '' }
];
