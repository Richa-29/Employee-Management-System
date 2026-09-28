import { Component, DestroyRef, inject, signal } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { BaseChartDirective  } from 'ng2-charts';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dept-chart',
  standalone: true,
  templateUrl: './department-chart.component.html',
  styleUrl: './department-chart.component.scss',
  imports: [BaseChartDirective ]
})
export class DepartmentChartComponent {

  private dashboardService = inject(DashboardService);
  private destroyRef = inject(DestroyRef);

  hasError = signal(false);
  chartData = signal<ChartData<'pie'>>({ labels: [], datasets: [] });
  chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };

  ngOnInit() {
    this.dashboardService.getEmployeesByDepartment()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          const deptMap = new Map<string, number>();
          data.forEach((e: any) => {
            const name = e.departments?.name ?? 'Unknown';
            deptMap.set(name, (deptMap.get(name) ?? 0) + 1);
          });
          this.chartData.set({
            labels: [...deptMap.keys()],
            datasets: [{
              data: [...deptMap.values()],
              backgroundColor: ['#3f51b5', '#e91e63', '#ff9800', '#4caf50', '#9c27b0']
            }]
          });
        },
        error: () => this.hasError.set(true)
      });
  }
}