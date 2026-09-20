import { Component, DestroyRef, inject, signal } from "@angular/core";
import { AuthService } from "../../../core/services/auth.service";
import { LeaveService } from "../../../core/services/leave.service";
import { LeaveRequest } from "../../../core/models/leave-request.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DatePipe } from "@angular/common";

@Component({
    selector: 'app-leave-approvals',
    templateUrl: './leave-approvals.component.html',
    styleUrl: './leave-approvals.component.scss',
    standalone: true,
    imports: [DatePipe]
})

export class ApproveLeaveComponent {
    private authService = inject(AuthService);
    private leaveService = inject(LeaveService);
    private destroyRef = inject(DestroyRef);

    leaves = signal<LeaveRequest[]>([]);
    isLoading = signal(true);

    ngOnInit() {
        const role = this.authService.role();
        const user = this.authService.user();
        if (role === 'admin') {
            this.leaveService.getAllLeaveRequests().pipe(
                takeUntilDestroyed(this.destroyRef)
            ).subscribe({
                next: (data) => {
                    this.leaves.set(data);
                    this.isLoading.set(false);
                },
                error: (err) => {
                    console.log(err);
                }
            })
        } else if (role === 'manager') {
            this.leaveService.getDepartmentLeaveRequests(user!.departmentId!).pipe(
                takeUntilDestroyed(this.destroyRef)
            ).subscribe({
                next: (data) => {
                    this.leaves.set(data);
                    this.isLoading.set(false);
                },
                error: (err) => {
                    console.log(err);
                }
            })
        }
    }

    updateStatus(leaveId: string, status: 'approved' | 'rejected') {
        const reviewedBy = this.authService.user()!.id;
        this.leaveService.updateLeaveStatus(leaveId, status, reviewedBy)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
            next: () => {
            this.leaves.update(leaves => leaves.filter(l => l.id !== leaveId));
            },
            error: (err) => console.error(err)
        });
  }
}