import { Component, inject, signal, ChangeDetectionStrategy, computed, DestroyRef } from "@angular/core";
import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../core/models/employee.model';
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-employee-list',
    standalone: true,
    templateUrl: './employee-list.component.html',
    styleUrl: './employee-list.component.scss',
    imports: [ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class EmployeeListComponent {
    private router = inject(Router);
    private employeeService = inject(EmployeeService);
    private destroyRef = inject(DestroyRef);
  
    employees = signal<Employee[]>([]);
    filteredEmployees = signal<Employee[]>([]);
    isSearching = signal<boolean>(false);
    isLoading = signal(true);
    error = signal<string | null>(null);
    currentPage = signal(1);
    pageSize = signal(10);
    totalCount = signal(0);
    totalPages = computed(() => Math.ceil(this.totalCount()/this.pageSize()));
    curentSortColumn: string = '';
    isAscending = signal<boolean>(true);

    searchInput = new FormControl<string>('', { nonNullable: true});

    constructor() {
    }

    ngOnInit() {
        this.getEmployees();
        this.searchInput.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(searchTerm=>{
                this.isSearching.set(searchTerm.length > 0);
                this.currentPage.set(1);
                return this.employeeService.getEmployees(this.currentPage(), this.pageSize(), searchTerm);
            })
        ).subscribe({
            next: ({data, count}) => {
                this.filteredEmployees.set(data);
                this.totalCount.set(count);
            }
        })
    }

    getEmployees() {
        this.isLoading.set(true);
        this.employeeService.getEmployees(this.currentPage(), this.pageSize())
        .subscribe({
            next: ({ data, count}) => {
                this.employees.set(data);
                this.filteredEmployees.set(data);
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

    viewEmployee(employee: Employee) {
        this.router.navigate(['/shell/employees', employee.id])
    }

    addNewEmployee() {
        this.router.navigate(['/shell/employees/add']);
    }

    goToEditEmployee(employeeId: string) {
        this.router.navigate(['/shell/employees', employeeId, 'edit']);
    }

    deleteEmployee(employeeId: string) {
        this.employeeService.deleteEmployee(employeeId).pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: () => {
                this.getEmployees();
            },
            error: (err) => {
                console.error('Delete failed', err);
            }
        });
    }

    sortTable(column: string) {
        if(this.curentSortColumn === column) {
            this.isAscending.update(isAsc => !isAsc);
        } else {
            this.curentSortColumn = column;
            this.isAscending.set(true); 
        }

       this.employees.update(emps => [...emps].sort((a, b) => {
            const val = this.isAscending() ? 1 : -1;
            let valA = column === 'department' 
            ? (a.department?.name ?? '') 
            : (a[column as keyof Employee] ?? '');
            
            let valB = column === 'department' 
            ? (b.department?.name ?? '') 
            : (b[column as keyof Employee] ?? '');

            return valA > valB ? val : -val;
        }));
    }
}


