import { Component, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Department } from "../../core/models/department.model";
import { DepartmentService } from "../../core/services/department.service";
import { EmployeeService } from "../../core/services/employee.service";
import { email } from "@angular/forms/signals";
import { Employee } from "../../core/models/employee.model";
import { Router } from "@angular/router";

@Component({
    selector: 'add-edit-employee',
    templateUrl: './add-edit-employee.component.html',
    styleUrl: './add-edit-employee.component.scss',
    imports: [ReactiveFormsModule],
    standalone: true
})

export class AddEditEmployeeComponent implements OnInit{
    private fb = inject(FormBuilder);
    private departmentService = inject(DepartmentService);
    private employeeService = inject(EmployeeService);
    private destroyRef = inject(DestroyRef);
    private router = inject(Router);

    departments =  signal<Department[]>([]);
    isEditMode = signal<boolean>(false);

    addEditEmployeeForm = this.fb.group({
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        role: ['employee', Validators.required],
        department: ['', Validators.required],
        jobTitle: [''],
        joinedAt: [new Date().toISOString().split('T')[0]]
    });

    ngOnInit() {
        this.departmentService.getDepartments().pipe(
            takeUntilDestroyed(this.destroyRef)
        )
        .subscribe((response)=>{
            this.departments.set(response);
        });
    }
    
    submitForm() {
        if(this.addEditEmployeeForm.invalid) return;
        const form = this.addEditEmployeeForm.getRawValue();
        const formValue: Partial<Employee> = {
            full_name: form.fullName ?? '',
            email: form.email ?? '',
            department_id: form.department ?? '',
            role: (form.role ?? 'employee') as 'admin' | 'manager' | 'employee',
            job_title: form.jobTitle ?? '',
            joined_at: form.joinedAt ?? ''
        }
        console.log(formValue);
        this.employeeService.addEmployee(formValue).pipe(
            takeUntilDestroyed(this.destroyRef)
        )
        .subscribe({
            next: (employee) => {
                this.router.navigate(['/shell/employees']);
            },
            error: (err) => {
                console.error(err);
            }
        })
    }
}