import { Component, inject, signal, ChangeDetectionStrategy, computed } from "@angular/core";
import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../core/models/employee.model';

@Component({
    selector: 'app-employee-list',
    standalone: true,
    templateUrl: './employee-list.component.html',
    styleUrl: './employee-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class EmployeeListComponent {
    private employeeService = inject(EmployeeService);
  
    employees = signal<Employee[]>([]);
    isLoading = signal(true);
    error = signal<string | null>(null);
    currentPage = signal(1);
    pageSize = signal(10);
    totalCount = signal(0);
    totalPages = computed(() => Math.ceil(this.totalCount()/this.pageSize()));

    ngOnInit() {
        this.getEmployees();
    }

    getEmployees() {
        this.isLoading.set(true);
        this.employeeService.getEmployees(this.currentPage(), this.pageSize())
        .subscribe({
            next: ({ data, count}) => {
                this.employees.set(data);
                this.totalCount.set(count);
                this.isLoading.set(false);
            },
            error: (err) => {
                this.error.set(err.message);
                this.isLoading.set(false);
            }
        })
    }

    goToPage(page: number) {
        this.currentPage.set(page);
        this.getEmployees();
    }
}


