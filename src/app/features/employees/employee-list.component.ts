import { Component, inject, signal, ChangeDetectionStrategy, computed } from "@angular/core";
import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../core/models/employee.model';
import { catchError, debounceTime, delay, distinctUntilChanged, forkJoin, interval, of, switchMap, timer } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

@Component({
    selector: 'app-employee-list',
    standalone: true,
    templateUrl: './employee-list.component.html',
    styleUrl: './employee-list.component.scss',
    imports: [ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class EmployeeListComponent {
    private employeeService = inject(EmployeeService);
  
    employees = signal<Employee[]>([]);
    filteredEmployees = signal<Employee[]>([]);
    isSearching = signal<boolean>(false);
    isLoading = signal(true);
    error = signal<string | null>(null);
    currentPage = signal(1);
    pageSize = signal(10);
    totalCount = signal(0);
    totalPages = computed(() => Math.ceil(this.totalCount()/this.pageSize()));

    searchInput = new FormControl<string>('', { nonNullable: true});

    constructor(private http: HttpClient) {
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


