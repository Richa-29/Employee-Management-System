import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChartData, ChartOptions } from 'chart.js';
import { DashboardService } from '../../../core/services/dashboard.service';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-leaves-chart',
  standalone: true,
  templateUrl: './leave-chart.component.html',
  styleUrl: './leave-chart.component.scss',
  imports: [BaseChartDirective]
})
export class LeaveChartComponent {
  private dashboardService = inject(DashboardService);
  private destroyRef = inject(DestroyRef);

  hasError = signal(false);
  chartData = signal<ChartData<'line'>>({ labels: [], datasets: [] });
  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };

  ngOnInit() {
    this.dashboardService.getLeavesByMonth()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          const monthMap = new Map<string, number>();
          data.forEach((l: any) => {
            const month = new Date(l.created_at)
              .toLocaleString('default', { month: 'short', year: '2-digit' });
            monthMap.set(month, (monthMap.get(month) ?? 0) + 1);
          });
          this.chartData.set({
            labels: [...monthMap.keys()],
            datasets: [{
              data: [...monthMap.values()],
              borderColor: '#3f51b5',
              backgroundColor: 'rgba(63,81,181,0.1)',
              fill: true,
              tension: 0.4
            }]
          });
        },
        error: () => this.hasError.set(true)
      });
  }
}