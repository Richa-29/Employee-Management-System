import { Component, DestroyRef, inject, signal } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ChartData, ChartOptions } from 'chart.js';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-role-chart',
  standalone: true,
  templateUrl: './role-chart.component.html',
  styleUrl: './role-chart.component.scss',
  imports: [BaseChartDirective]
})
export class RoleChartComponent {
  private dashboardService = inject(DashboardService);
  private destroyRef = inject(DestroyRef);

  hasError = signal(false);
  chartData = signal<ChartData<'bar'>>({ labels: [], datasets: [] });
  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } }
  };

  ngOnInit() {
    this.dashboardService.getEmployeesByRole()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          const roleMap = { admin: 0, manager: 0, employee: 0 };
          data.forEach((e: any) => {
            if (e.role in roleMap) roleMap[e.role as keyof typeof roleMap]++;
          });
          this.chartData.set({
            labels: ['Admin', 'Manager', 'Employee'],
            datasets: [{
              data: [roleMap.admin, roleMap.manager, roleMap.employee],
              backgroundColor: ['#e91e63', '#3f51b5', '#4caf50']
            }]
          });
        },
        error: () => this.hasError.set(true)
      });
  }
}