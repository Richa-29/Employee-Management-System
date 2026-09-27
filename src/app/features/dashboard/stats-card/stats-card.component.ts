import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DashboardService } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  templateUrl: './stats-card.component.html',
  styleUrl: './stats-card.component.scss'
})
export class StatsCardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private destroyRef = inject(DestroyRef);

  totalEmployees = signal<number | null>(null);
  totalDepartments = signal<number | null>(null);
  pendingLeaves = signal<number | null>(null);
  totalManagers = signal<number | null>(null);

  ngOnInit() {
    this.dashboardService.getTotalEmployees()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (count) => this.totalEmployees.set(count),
        error: () => this.totalEmployees.set(0)
      });

    this.dashboardService.getTotalDepartments()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (count) => this.totalDepartments.set(count),
        error: () => this.totalDepartments.set(0)
      });

    this.dashboardService.getPendingLeaves()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (count) => this.pendingLeaves.set(count),
        error: () => this.pendingLeaves.set(0)
      });

    this.dashboardService.getTotalManagers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (count) => this.totalManagers.set(count),
        error: () => this.totalManagers.set(0)
      });
  }
}