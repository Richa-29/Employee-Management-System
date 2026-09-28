import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { AuthService } from "../../core/services/auth.service";
import { StatsCardComponent } from "./stats-card/stats-card.component";
import { DepartmentChartComponent } from "./department/department-chart.component";
import { RoleChartComponent } from "./role/role-chart.component";
import { LeaveChartComponent } from "./leave/leave-chart.component";
import { EmployeeDashboardComponent } from "./components/employee-dashboard/employee-dashboard.component";

@Component ({
    selector: 'app-dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    imports: [StatsCardComponent, DepartmentChartComponent, RoleChartComponent, LeaveChartComponent, EmployeeDashboardComponent]
})

export class DashboardComponent {
    private authService = inject(AuthService);
    role = computed(() => this.authService.role() ?? 'admin'); 
}