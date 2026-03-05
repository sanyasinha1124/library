import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: any = null;
  overdueIssues: any[] = [];
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.http.get('http://localhost:3001/api/stats/dashboard').pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => { this.stats = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
    this.http.get<any>('http://localhost:3001/api/stats/reports/overdue').pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => this.overdueIssues = data.overdueIssues || [],
      error: () => {}
    });
  }

  trackById(index: number, item: any): number { return item.issueId || index; }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
