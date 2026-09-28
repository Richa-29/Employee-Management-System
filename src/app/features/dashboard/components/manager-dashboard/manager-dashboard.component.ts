import { Component, inject, signal, OnInit, DestroyRef, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { LeaveService } from '../../../../core/services/leave.service';
import { EmployeeService } from '../../../../core/services/employee.service';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.scss'
})
export class ManagerDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private leaveService = inject(LeaveService);
  private employeeService = inject(EmployeeService);
  private destroyRef = inject(DestroyRef);

  teamCount = signal(0);
  pendingLeaves = signal(0);
  user = this.authService.user;

  ngOnInit() {
    const departmentId = this.authService.user()?.departmentId;
    if (!departmentId) return;

    this.employeeService.getEmployeesByDepartment(departmentId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.teamCount.set(data.length),
        error: (err) => console.error(err)
      });

    this.leaveService.getDepartmentLeaveRequests(departmentId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.pendingLeaves.set(data.length),
        error: (err) => console.error(err)
      });
  }
}