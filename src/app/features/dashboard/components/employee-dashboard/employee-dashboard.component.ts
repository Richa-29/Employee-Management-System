import { Component, inject, signal, OnInit, DestroyRef, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../core/services/auth.service';
import { LeaveService } from '../../../../core/services/leave.service';
import { LeaveRequest } from '../../../../core/models/leave-request.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.scss'
})
export class EmployeeDashboardComponent implements OnInit {
  authService = inject(AuthService);
  private leaveService = inject(LeaveService);
  private destroyRef = inject(DestroyRef);

  leaves = signal<LeaveRequest[]>([]);

  pendingCount = computed(() => this.leaves().filter(l => l.status === 'pending').length);
  approvedCount = computed(() => this.leaves().filter(l => l.status === 'approved').length);
  rejectedCount = computed(() => this.leaves().filter(l => l.status === 'rejected').length);

  ngOnInit() {
    const employeeId = this.authService.user()!.id;
    this.leaveService.getMyLeaveStats(employeeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.leaves.set(data),
        error: (err) => console.error(err)
      });
  }
}