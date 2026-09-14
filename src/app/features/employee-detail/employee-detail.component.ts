import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { EmployeeService } from "../../core/services/employee.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Employee } from "../../core/models/employee.model";

@Component({
    selector: 'app-employee-detail',
    templateUrl: './employee-detail.component.html',
    styleUrl: './employee-detail.component.scss',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class EmployeeDetailComponent implements OnInit{

    private activatedRoute = inject(ActivatedRoute);
    private employeeService = inject(EmployeeService);
    private destroyedRef = inject(DestroyRef);
    private router = inject(Router);

    employee = signal<Employee | null>(null);
    isLoading = signal<boolean>(true);
    error = signal<string | null>(null);
    
    ngOnInit() {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        if(id) {
            this.getEmployeeById(id);
        }
    }

    getEmployeeById(id: string) {
        this.employeeService.getEmployeeById(id).pipe(
            takeUntilDestroyed(this.destroyedRef)
        )
        .subscribe({
            next: (employee)=> {
                this.employee.set(employee);
                this.isLoading.set(false);
            },
            error: (err)=>{
                this.error.set(err);
                this.isLoading.set(false);
            }
        });
    }

    editEmployee() {
        this.router.navigate(['shell/employees/', this.employee()?.id ,'edit'])
    }
}