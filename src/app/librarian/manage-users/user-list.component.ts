import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  isLoading = false;
  message = '';
  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void { this.loadUsers(); }

  loadUsers(): void {
    this.isLoading = true;
    this.http.get<User[]>('http://localhost:3001/api/users').pipe(takeUntil(this.destroy$)).subscribe({
      next: (users) => { this.users = users; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  toggleActive(user: User): void {
    if (!confirm((user.isActive ? 'Deactivate ' : 'Activate ') + user.username + '?')) return;
    this.http.put('http://localhost:3001/api/users/' + user.id, { isActive: !user.isActive }).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => { this.message = '✅ Done.'; this.loadUsers(); },
      error: () => { this.message = '❌ Failed.'; }
    });
  }

  trackById(index: number, user: User): number { return user.id; }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
