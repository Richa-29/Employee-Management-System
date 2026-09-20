import { Component, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { Department } from "../../core/models/department.model";
import { DepartmentService } from "../../core/services/department.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'app-department-list',
    templateUrl: './department-list.component.html',
    styleUrl: './department-list.component.scss',
    standalone: true,
    imports: [FormsModule]
})

export class DepartmentListComponent implements OnInit{
     departments = signal<Department[]>([]);
     isLoading = signal(true);
     newDepartmentName = '';

    private departmentService = inject(DepartmentService);
    private destroyRef = inject(DestroyRef);

    ngOnInit(): void {
        this.getAllDepartments();
    }

    getAllDepartments() {
        this.departmentService.getDepartments().pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: (data) => {
                this.departments.set(data);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.log(err);
            }
        })
    }

    addDepartment() {
        if (!this.newDepartmentName.trim()) return;

        this.departmentService.addDepartment(this.newDepartmentName).pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: () => {
                this.newDepartmentName = '';
                this.getAllDepartments(); 
            },
            error: (err) => {
                console.error(err)
            }
        });
    }

    deleteDepartment(id: string) {
        if (!confirm('Are you sure?')) return;

        this.departmentService.deleteDepartment(id).pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: () => {
                this.getAllDepartments();
            },
            error: (err) => {
                console.error(err)
            }
        });
    }
    
}