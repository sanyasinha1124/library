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

  <!-- HEADER -->
  <div class="page-header">
    <div>
      <h1>My Books</h1>
      <p>Track your borrowed books and manage due dates</p>
    </div>

    <div class="summary-card" *ngIf="totalFine > 0">
      <div class="fine-label">Total Pending Fine</div>
      <div class="fine-amount">₹ {{ totalFine }}</div>
    </div>
  </div>

  <!-- LOADING -->
  <div *ngIf="loading" class="state-card">
    <div class="spinner"></div>
    <p>Loading your books...</p>
  </div>

  <!-- EMPTY -->
  <div *ngIf="!loading && issues.length === 0" class="state-card">
    <h3>No books borrowed yet</h3>
    <p>Borrow books from the catalog to see them here 📚</p>
  </div>

  <!-- BOOK GRID -->
  <div class="book-grid" *ngIf="!loading && issues.length > 0">

    <div 
      *ngFor="let issue of issues"
      class="book-card"
      [class.overdue]="isOverdue(issue.dueDate)"
    >

      <div class="card-header">
        <div>
          <h3>{{ issue.book.title }}</h3>
          <p class="author">{{ issue.book.author }}</p>
        </div>

        <span 
          class="status"
          [class.bad]="isOverdue(issue.dueDate)"
        >
          {{ isOverdue(issue.dueDate) ? 'Overdue' : 'Active' }}
        </span>
      </div>

      <div class="due-info">
        <span class="label">Due Date</span>
        <strong>{{ issue.dueDate | date:'mediumDate' }}</strong>
      </div>

      <div 
        *ngIf="calculateFine(issue.dueDate) > 0"
        class="fine-box"
      >
        Fine: ₹ {{ calculateFine(issue.dueDate) }}
      </div>

      <div class="actions">
        <button class="renew-btn">Renew</button>
        <button class="return-btn">Return</button>
      </div>

    </div>

  </div>

</div>
`,
styles: [`

.page {
  padding: 40px;
  background: #f1f5f9;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

/* HEADER */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 30px;
  margin: 0;
  font-weight: 600;
}

.page-header p {
  margin-top: 6px;
  color: #64748b;
}

/* SUMMARY */
.summary-card {
  background: linear-gradient(135deg, #ef4444, #b91c1c);
  color: white;
  padding: 18px 28px;
  border-radius: 16px;
  box-shadow: 0 15px 40px rgba(239, 68, 68, 0.3);
}

.fine-label {
  font-size: 12px;
  opacity: 0.9;
}

.fine-amount {
  font-size: 24px;
  font-weight: 700;
}

/* GRID */
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 28px;
}

/* CARD */
.book-card {
  background: white;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.06);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.book-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.08);
}

.book-card.overdue {
  border-left: 6px solid #ef4444;
}

/* HEADER */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.author {
  font-size: 14px;
  color: #64748b;
  margin-top: 4px;
}

/* STATUS */
.status {
  font-size: 11px;
  padding: 5px 14px;
  border-radius: 20px;
  font-weight: 600;
  background: #dcfce7;
  color: #166534;
}

.status.bad {
  background: #fee2e2;
  color: #991b1b;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* DUE INFO */
.due-info {
  font-size: 14px;
}

.label {
  display: block;
  font-size: 12px;
  color: #94a3b8;
}

/* FINE */
.fine-box {
  padding: 8px 12px;
  border-radius: 8px;
  background: #fff1f2;
  color: #b91c1c;
  font-weight: 600;
  font-size: 13px;
}

/* ACTIONS */
.actions {
  margin-top: auto;
  display: flex;
  gap: 10px;
}

.actions button {
  flex: 1;
  padding: 8px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s;
}

.renew-btn {
  background: #2563eb;
  color: white;
}

.renew-btn:hover {
  background: #1d4ed8;
}

.return-btn {
  background: #f1f5f9;
  color: #334155;
}

.return-btn:hover {
  background: #e2e8f0;
}

/* STATES */
.state-card {
  background: white;
  padding: 60px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.spinner {
  width: 36px;
  height: 36px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .page {
    padding: 20px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
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
isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date();
}

}