import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueService } from './issue.service';
import { Fine, FineService } from './fine.service';
import { LibraryConfigService,LibraryConfig } from '../../core/library-config.service';
@Component({
  standalone: true,
  selector: 'app-my-books',
  imports: [CommonModule],
  template: `
  <div class="page">

    <header class="header">
      <h1>📚 My Library</h1>
      <p>Manage your borrowed books and fines</p>
    </header>

    <!-- Fine Summary -->
    <section class="fine-card" *ngIf="totalFine > 0">
  <div>
    <h3>Total Pending Fine</h3>
    <p class="amount">₹ {{ totalFine }}</p>
  </div>
  <button class="pay-btn">
    Pay Now
  </button>
</section>

    <!-- Borrowed Books -->
    <section>
      <h2>Borrowed Books</h2>

      <div *ngIf="loading" class="loading">
        Loading your books...
      </div>
      

      <div *ngIf="!loading && issues.length === 0" class="empty">
        No books borrowed yet.
      </div>

      <div class="book-grid">
        <div 
          *ngFor="let issue of issues"
          class="book-card"
          [class.overdue]="isOverdue(issue.dueDate)"
        >
          <div class="book-info">
            <h3>{{ issue.book.title }}</h3>
            <p>Author: {{ issue.book.author }}</p>
          </div>

          <div class="meta">
            <p>
              Due: 
              <strong>
                {{ issue.dueDate | date:'mediumDate' }}
              </strong>
            </p>

            <span 
              class="status"
              [class.bad]="isOverdue(issue.dueDate)"
            >
              {{ isOverdue(issue.dueDate) ? 'Overdue' : 'Active' }}
            </span>
          </div>
        </div>
      </div>

    </section>

  </div>
  `,
  styles: [`
    * {
      box-sizing: border-box;
      font-family: 'Segoe UI', sans-serif;
    }

    .page {
      padding: 2rem;
      background: #f4f6f9;
      min-height: 100vh;
    }

    .header {
      margin-bottom: 2rem;
    }

    .header h1 {
      margin: 0;
      font-size: 28px;
    }

    .header p {
      color: #6b7280;
      margin-top: 4px;
    }

    h2 {
      margin-bottom: 1rem;
    }

    /* Fine Card */
    .fine-card {
      background: linear-gradient(135deg, #2563eb, #1e3a8a);
      color: white;
      padding: 1.5rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 6px 15px rgba(0,0,0,0.1);
    }

    .amount {
      font-size: 22px;
      font-weight: bold;
      margin-top: 5px;
    }

    .pay-btn {
      background: white;
      color: #1e3a8a;
      border: none;
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: 0.3s;
    }

    .pay-btn:hover {
      transform: translateY(-2px);
    }

    /* Books Grid */
    .book-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .book-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      transition: 0.3s;
      border-left: 6px solid #2563eb;
    }

    .book-card:hover {
      transform: translateY(-4px);
    }

    .book-card.overdue {
      border-left: 6px solid #ef4444;
    }

    .book-info h3 {
      margin: 0 0 5px 0;
    }

    .meta {
      margin-top: 1rem;
      font-size: 14px;
      color: #6b7280;
    }

    .status {
      display: inline-block;
      margin-top: 6px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      background: #dcfce7;
      color: #166534;
    }

    .status.bad {
      background: #fee2e2;
      color: #991b1b;
    }

    .loading,
    .empty {
      padding: 2rem;
      text-align: center;
      color: #6b7280;
    }

    @media (max-width: 768px) {
      .page {
        padding: 1rem;
      }

      .fine-card {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }
  `]
})
export class MyBooksComponent implements OnInit {
  config!: LibraryConfig;
  issues: any[] = [];
  fines: Fine[] = [];
  loading = true;

  constructor(
    private issueService: IssueService,
    private fineService: FineService,
    private configService: LibraryConfigService
  ) {}

ngOnInit(): void {

    this.loading = true;

    this.issueService.getMyIssues().subscribe(res => {
      this.issues = res;
    });

    this.fineService.getMyFines().subscribe(res => {
      this.fines = res;
      this.loading = false;
    });
    this.configService.getConfig().subscribe(res => {
  this.config = res;
});

  }
calculateFine(dueDate: string): number {

  if (!this.config?.fines.enabled) return 0;

  const today = new Date();
  const due = new Date(dueDate);

  const diffTime = today.getTime() - due.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= this.config.fines.gracePeriodDays) {
    return 0;
  }

  const fineDays = diffDays - this.config.fines.gracePeriodDays;
  const calculatedFine = fineDays * this.config.fines.perDayRate;

  return Math.min(calculatedFine, this.config.fines.maxFinePerBook);
}
get totalFine(): number {
  return this.issues.reduce((sum, issue) => {
    return sum + this.calculateFine(issue.dueDate);
  }, 0);
}

}