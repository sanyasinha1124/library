// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { forkJoin } from 'rxjs';
// import { IssueService } from '../books/my-books/issue.service';
// import { LibraryConfigService, LibraryConfig } from '../core/library-config.service';

// @Component({
//   standalone: true,
//   selector: 'app-my-books',
//   imports: [CommonModule],
//   template: `
//   <div class="page">

//     <header class="header">
//       <h1>📚 My Borrowed Books</h1>
//       <p>Track your active loans and fines</p>
//     </header>

//     <!-- Total Fine Card -->
//     <section class="fine-card" *ngIf="totalFine > 0">
//       <div>
//         <h3>Total Pending Fine</h3>
//         <p class="amount">₹ {{ totalFine }}</p>
//       </div>
//     </section>

//     <!-- Loading -->
//     <div *ngIf="loading" class="loading">
//       Loading your books...
//     </div>

//     <!-- Empty -->
//     <div *ngIf="!loading && issues.length === 0" class="empty">
//       You have not borrowed any books.
//     </div>

//     <!-- Book Grid -->
//     <div class="book-grid" *ngIf="!loading && issues.length > 0">
//       <div 
//         *ngFor="let issue of issues"
//         class="book-card"
//         [class.overdue]="isOverdue(issue.dueDate)"
//       >

//         <h3>{{ issue.book.title }}</h3>
//         <p class="author">by {{ issue.book.author }}</p>

//         <p class="due">
//           Due: <strong>{{ issue.dueDate | date:'mediumDate' }}</strong>
//         </p>

//         <span 
//           class="status"
//           [class.bad]="isOverdue(issue.dueDate)"
//         >
//           {{ isOverdue(issue.dueDate) ? 'Overdue' : 'Active' }}
//         </span>

//         <p *ngIf="calculateFine(issue.dueDate) > 0" class="fine">
//           Fine: ₹ {{ calculateFine(issue.dueDate) }}
//         </p>

//       </div>
//     </div>

//   </div>
//   `,
//   styles: [`
//     * {
//       box-sizing: border-box;
//       font-family: 'Segoe UI', sans-serif;
//     }

//     .page {
//       padding: 2rem;
//       background: #f4f6f9;
//       min-height: 100vh;
//     }

//     .header {
//       margin-bottom: 2rem;
//     }

//     .header h1 {
//       margin: 0;
//       font-size: 26px;
//     }

//     .header p {
//       color: #6b7280;
//       margin-top: 4px;
//     }

//     /* Fine Card */
//     .fine-card {
//       background: linear-gradient(135deg, #ef4444, #b91c1c);
//       color: white;
//       padding: 1.5rem;
//       border-radius: 12px;
//       margin-bottom: 2rem;
//       box-shadow: 0 6px 15px rgba(0,0,0,0.1);
//     }

//     .amount {
//       font-size: 22px;
//       font-weight: bold;
//       margin-top: 5px;
//     }

//     /* Grid */
//     .book-grid {
//       display: grid;
//       grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
//       gap: 1.5rem;
//     }

//     .book-card {
//       background: white;
//       padding: 1.5rem;
//       border-radius: 12px;
//       box-shadow: 0 4px 12px rgba(0,0,0,0.05);
//       border-left: 6px solid #2563eb;
//       transition: 0.3s;
//     }

//     .book-card:hover {
//       transform: translateY(-4px);
//     }

//     .book-card.overdue {
//       border-left: 6px solid #ef4444;
//     }

//     .author {
//       color: #6b7280;
//       font-size: 14px;
//       margin-bottom: 10px;
//     }

//     .due {
//       font-size: 14px;
//     }

//     .status {
//       display: inline-block;
//       margin-top: 8px;
//       padding: 4px 10px;
//       border-radius: 20px;
//       font-size: 12px;
//       background: #dcfce7;
//       color: #166534;
//     }

//     .status.bad {
//       background: #fee2e2;
//       color: #991b1b;
//     }

//     .fine {
//       margin-top: 10px;
//       font-weight: 600;
//       color: #b91c1c;
//     }

//     .loading, .empty {
//       text-align: center;
//       padding: 2rem;
//       color: #6b7280;
//     }

//     @media (max-width: 768px) {
//       .page {
//         padding: 1rem;
//       }
//     }
//   `]
// })
// export class MyBooksComponent implements OnInit {

//   issues: any[] = [];
//   config!: LibraryConfig;
//   loading = true;

//   constructor(
//     private issueService: IssueService,
//     private configService: LibraryConfigService
//   ) {}

//   ngOnInit(): void {

//     this.loading = true;

//     forkJoin({
//       issues: this.issueService.getMyIssues(),
//       config: this.configService.getConfig()
//     }).subscribe(res => {
//       this.issues = res.issues;
//       this.config = res.config;
//       this.loading = false;
//     });

//   }

//   isOverdue(dueDate: string): boolean {
//     if (!this.config) return false;

//     const today = new Date();
//     const due = new Date(dueDate);

//     const diffTime = today.getTime() - due.getTime();
//     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

//     return diffDays > this.config.fines.gracePeriodDays;
//   }

//   calculateFine(dueDate: string): number {

//     if (!this.config?.fines.enabled) return 0;

//     const today = new Date();
//     const due = new Date(dueDate);

//     const diffTime = today.getTime() - due.getTime();
//     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays <= this.config.fines.gracePeriodDays) {
//       return 0;
//     }

//     const fineDays = diffDays - this.config.fines.gracePeriodDays;
//     const calculatedFine = fineDays * this.config.fines.perDayRate;

//     return Math.min(calculatedFine, this.config.fines.maxFinePerBook);
//   }

//   get totalFine(): number {
//     return this.issues.reduce((sum, issue) => {
//       return sum + this.calculateFine(issue.dueDate);
//     }, 0);
//   }

// }
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IssueService } from './issue.service';
import { FineService } from './fine.service';
import { AuthService } from '../auth/auth.service';
import { Issue } from '../models/issue.model';
import { User } from '../models/user.model';
import { LoadingSpinnerComponent } from '../shared/loading-spinner.component';
import { DaysUntilPipe } from '../shared/days-until.pipe';
import { OverdueStatusPipe } from '../shared/overdue-status.pipe';

@Component({
  selector: 'app-my-books',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, LoadingSpinnerComponent, DaysUntilPipe, OverdueStatusPipe],
  templateUrl: './my-books.component.html'
})
export class MyBooksComponent implements OnInit, OnDestroy {
  issues: Issue[] = [];
  finesData: any = null;
  unpaidFines: any[] = [];   // individual unpaid fines
  currentUser: User | null = null;
  isLoading = false;
  message = '';
  private destroy$ = new Subject<void>();

  constructor(
    private issueService: IssueService,
    private fineService: FineService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadMyIssues();
        this.loadMyFines(user.id);
      }
    });
  }

  loadMyIssues(): void {
    this.isLoading = true;
    this.issueService.getMyIssues().pipe(takeUntil(this.destroy$)).subscribe({
      next: (issues) => { this.issues = issues; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  loadMyFines(userId: number): void {
    this.fineService.getMyFines(userId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: any) => {
        this.finesData = data;
        // grab the list of unpaid fines from issuesWithFines
        this.unpaidFines = (data.issuesWithFines || []).filter((f: any) => !f.finePaid);
      },
      error: () => {}
    });
  }

  returnBook(issueId: number): void {
    if (!confirm('Return this book?')) return;
    this.issueService.returnBook(issueId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.message = res.fine > 0
          ? '✅ Returned! You have a fine of $' + res.fine + '. Please pay it in the fines section.'
          : '✅ Returned successfully!';
        this.loadMyIssues();
        if (this.currentUser) this.loadMyFines(this.currentUser.id);
      },
      error: (err) => { this.message = '❌ ' + (err.error?.error || 'Could not return.'); }
    });
  }

  renewBook(issueId: number): void {
    this.issueService.renewBook(issueId).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => { this.message = '✅ Renewed! Due date extended by 14 days.'; this.loadMyIssues(); },
      error: (err) => { this.message = '❌ ' + (err.error?.error || 'Could not renew.'); }
    });
  }

  payFine(issueId: number): void {
    this.fineService.payFine(issueId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.message = '✅ Fine of $' + res.amountPaid + ' paid successfully!';
        if (this.currentUser) this.loadMyFines(this.currentUser.id);
      },
      error: (err) => { this.message = '❌ ' + (err.error?.error || 'Could not pay fine.'); }
    });
  }

  trackByIssueId(index: number, issue: Issue): number { return issue.id; }
  trackByFine(index: number, fine: any): number { return fine.issueId; }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}