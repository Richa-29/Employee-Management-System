import { Component, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Department } from "../../core/models/department.model";
import { DepartmentService } from "../../core/services/department.service";
import { EmployeeService } from "../../core/services/employee.service";
import { Employee } from "../../core/models/employee.model";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'add-edit-employee',
    templateUrl: './add-edit-employee.component.html',
    styleUrl: './add-edit-employee.component.scss',
    imports: [
                ReactiveFormsModule,
                MatDatepickerModule,
                MatNativeDateModule,
                MatFormFieldModule,
                MatInputModule
    ],
    standalone: true
})

export class AddEditEmployeeComponent implements OnInit{
    private fb = inject(FormBuilder);
    private departmentService = inject(DepartmentService);
    private employeeService = inject(EmployeeService);
    private destroyRef = inject(DestroyRef);
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);

    departments =  signal<Department[]>([]);
    isEditMode = signal<boolean>(false);
    employeeToEdit: string = '';

    addEditEmployeeForm = this.fb.group({
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        role: ['employee', Validators.required],
        department: ['', Validators.required],
        jobTitle: ['', Validators.required],
        joinedAt: [new Date().toISOString().split('T')[0]]
    });

    ngOnInit() {
        this.departmentService.getDepartments().pipe(
            takeUntilDestroyed(this.destroyRef)
        )
        .subscribe((response)=>{
            this.departments.set(response);
        });

        const id = this.activatedRoute.snapshot.paramMap.get('id');
        if(id) {
            this.employeeToEdit = id;
            this.isEditMode.set(true);
            this.addEditEmployeeForm.controls['password'].clearValidators();
            this.addEditEmployeeForm.controls['password'].updateValueAndValidity();
            this.employeeService.getEmployeeById(id).pipe(
                takeUntilDestroyed(this.destroyRef)
            ).subscribe((employee) => {
                this.addEditEmployeeForm.patchValue({
                    fullName: employee.fullName,
                    email: employee.email,
                    role: employee.role,
                    department: employee.departmentId,
                    jobTitle: employee.jobTitle,
                    joinedAt: employee.joinedAt
                });
            })
        }
    }

    mapEmployeeToApi(employee: Partial<Employee>): any {
        return {
            full_name: employee.fullName,
            email: employee.email,
            role: employee.role,
            department_id: employee.departmentId,
            job_title: employee.jobTitle,
            joined_at: employee.joinedAt
        };
    }
    
    submitForm() {
        let payload = {};
        if(this.addEditEmployeeForm.invalid) return;
        const form = this.addEditEmployeeForm.getRawValue();
        const formatDate = (date: Date | string) => {
            if (!date) return '';
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        
        const formValue: Partial<Employee> = {
            fullName: form.fullName ?? '',
            email: form.email ?? '',
            departmentId: form.department ?? '',
            role: (form.role ?? 'employee') as 'admin' | 'manager' | 'employee',
            jobTitle: form.jobTitle ?? '',
            joinedAt: formatDate(form.joinedAt ?? ''),
        }

        if(!this.isEditMode()) {
            payload = {
                ...this.mapEmployeeToApi(formValue),
                password: form.password ?? ''
            };
        } else {
            payload = {
                ...this.mapEmployeeToApi(formValue),
            };
        }
        
        if(this.isEditMode()) {
            this.employeeService.updateEmployee(this.employeeToEdit!, payload).pipe(
                takeUntilDestroyed(this.destroyRef)
            ).subscribe({
                next: () => {
                    this.router.navigate(['/shell/employees'])
                },
                error: (err) => {
                    console.error(err)
                }
            });
        } else {
            this.employeeService.addEmployee(payload).pipe(
                takeUntilDestroyed(this.destroyRef)
            ).subscribe({
                next: () => {
                    this.router.navigate(['/shell/employees']);
                },
                error: (err) => {
                    console.error(err);
                }
            })
        }
    }
}