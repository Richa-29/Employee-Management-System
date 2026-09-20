import { Component, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { LeaveService } from "../../../core/services/leave.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AuthService } from "../../../core/services/auth.service";
import { LeaveRequest } from "../../../core/models/leave-request.model";
import { DatePipe } from "@angular/common";

@Component({
    selector: 'app-leave-apply',
    templateUrl: './leave-apply.component.html',
    styleUrl: './leave-apply.component.scss',
    standalone: true,
    imports: [ReactiveFormsModule, DatePipe]
})

export class LeaveApplyComponent implements OnInit{
    private fb = inject(FormBuilder);
    private leaveService = inject(LeaveService);
    private destroyRef = inject(DestroyRef);
    private authService = inject(AuthService);

    myLeaves = signal<LeaveRequest[]>([]);

    leaveRequestForm = this.fb.nonNullable.group({
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        reason: ['', Validators.required]
    });

    ngOnInit(): void {
        this.getMyLeaves();
    }
    
    applyLeave() {
        if (this.leaveRequestForm.invalid) return;
        const formValue = this.leaveRequestForm.getRawValue();
        const leaveData = {
            employee_id: this.authService.user()?.id,
            start_date: formValue.startDate,
            end_date: formValue.endDate,
            reason: formValue.reason
        }
        this.leaveService.applyLeave(leaveData).pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: () => {
                alert('Leave Applied!');
                this.leaveRequestForm.reset();
                this.getMyLeaves();
            },
            error: (err) => {
                console.log(err);
            }
        });
    }

    getMyLeaves() {
        this.leaveService.getMyLeaves(this.authService.user()!.id).pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: (response) => {
                this.myLeaves.set(response);
            },
            error: (err) => {
                console.log(err);
            }
         })
    }
}