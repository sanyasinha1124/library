

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueService } from './issue.service';
import {  FineService } from './fine.service';
import { LibraryConfigService,LibraryConfig } from '../core/library-config.service';
import { Fine } from '../models/fine.model';
import { AuthService } from '../auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-my-books',
  imports: [CommonModule],
template: `
<div class="page">

  <div class="container">

    <!-- HEADER -->
    <div class="page-header">

      <div class="header-left">
        <h1>📚 My Borrowed Books</h1>
        <p>Track your books, due dates and fines</p>
      </div>

      <div class="summary-card" *ngIf="totalFine > 0">
        <span>Total Pending Fine</span>
        <strong>₹ {{ totalFine }}</strong>
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
      <p>Borrow books from the library catalog 📖</p>
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

          <span class="status"
            [class.overdue-status]="isOverdue(issue.dueDate)">
            {{ isOverdue(issue.dueDate) ? 'Overdue' : 'Active' }}
          </span>

        </div>

        <div class="book-details">

          <div class="due">
            <span>Due Date</span>
            <strong>{{ issue.dueDate | date:'mediumDate' }}</strong>
          </div>

          <div *ngIf="calculateFine(issue.dueDate) > 0" class="fine">
            Fine: ₹ {{ calculateFine(issue.dueDate) }}
          </div>

        </div>

       <div class="actions">
  <div *ngIf="getSpecificFine(issue.id) as fine; else actionButtons">
    <button class="pay-btn" (click)="payFine(issue.id)" style="background: #16a34a; color: white; width: 100%; border-radius: 8px; padding: 10px; border: none; cursor: pointer;">
      💳 Pay Fine (₹{{ fine.fine }})
    </button>
  </div>

  <ng-template #actionButtons>
    <div style="display: flex; gap: 10px; width: 100%;">
      <button 
        class="renew-btn" 
        [disabled]="isOverdue(issue.dueDate)" 
        (click)="renewBook(issue.id)">
        Renew
      </button>
      
      <button 
        class="return-btn" 
        (click)="returnBook(issue.id)">
        Return
      </button>
    </div>
  </ng-template>
</div>

        

      </div>

    </div>

  </div>

</div>
`,
styles: [`

/* PAGE */

.page{
  background:#f8fafc;
  min-height:100vh;
  padding:40px 20px;
  font-family: 'Inter', sans-serif;
}

.container{
  max-width:1200px;
  margin:auto;
}

/* HEADER */

.page-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:40px;
}

.header-left h1{
  margin:0;
  font-size:32px;
  color:#0f172a;
}

.header-left p{
  margin-top:6px;
  color:#64748b;
}

/* SUMMARY CARD */

.summary-card{
  background:linear-gradient(135deg,#b91c1c,#ef4444);
  color:white;
  padding:18px 28px;
  border-radius:14px;
  display:flex;
  flex-direction:column;
  box-shadow:0 10px 30px rgba(0,0,0,0.1);
}

.summary-card span{
  font-size:13px;
  opacity:.9;
}

.summary-card strong{
  font-size:22px;
}

/* GRID */

.book-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(320px,1fr));
  gap:28px;
}

/* BOOK CARD */

.book-card{
  background:white;
  border-radius:16px;
  padding:22px;
  box-shadow:0 8px 25px rgba(0,0,0,0.06);
  border:1px solid #e2e8f0;
  transition:all .3s ease;
  display:flex;
  flex-direction:column;
  gap:16px;
}

.book-card:hover{
  transform:translateY(-6px);
  box-shadow:0 12px 30px rgba(0,0,0,0.08);
}

.book-card.overdue{
  border-left:5px solid #dc2626;
}

/* CARD HEADER */

.card-header{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
}

.card-header h3{
  margin:0;
  font-size:18px;
  color:#0f172a;
}

.author{
  font-size:14px;
  color:#64748b;
  margin-top:4px;
}

/* STATUS */

.status{
  font-size:12px;
  padding:5px 14px;
  border-radius:20px;
  background:#dcfce7;
  color:#166534;
  font-weight:600;
}

.overdue-status{
  background:#fee2e2;
  color:#991b1b;
}

/* DETAILS */

.book-details{
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.due span{
  display:block;
  font-size:12px;
  color:#64748b;
}

.due strong{
  font-size:14px;
}

.fine{
  background:#fff1f2;
  padding:6px 12px;
  border-radius:8px;
  color:#b91c1c;
  font-size:13px;
  font-weight:600;
}

/* ACTION BUTTONS */

.actions{
  display:flex;
  gap:10px;
  margin-top:auto;
}

.actions button{
  flex:1;
  padding:10px;
  border:none;
  border-radius:8px;
  font-weight:500;
  cursor:pointer;
  transition:.2s;
}

/* RENEW */

.renew-btn{
  background:#1e3a8a;
  color:white;
}

.renew-btn:hover{
  background:#172554;
}

/* RETURN */

.return-btn{
  background:#e2e8f0;
  color:#1e293b;
}

.return-btn:hover{
  background:#cbd5f5;
}

/* STATE CARD */

.state-card{
  background:white;
  padding:60px;
  border-radius:16px;
  text-align:center;
  box-shadow:0 8px 20px rgba(0,0,0,0.05);
}

/* SPINNER */

.spinner{
  width:36px;
  height:36px;
  border:4px solid #e2e8f0;
  border-top:4px solid #1e3a8a;
  border-radius:50%;
  margin:auto;
  margin-bottom:20px;
  animation:spin 1s linear infinite;
}

@keyframes spin{
  to{ transform:rotate(360deg);}
}

/* RESPONSIVE */

@media(max-width:768px){

.page-header{
  flex-direction:column;
  align-items:flex-start;
  gap:20px;
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
    private configService: LibraryConfigService,
    private authService: AuthService
  ) {}
ngOnInit(): void {

  const user = this.authService.getCurrentUser();

  if (!user || !user.id) {
    console.error("No user found!");
    this.loading = false;
    return;
  }

  const userId = user.id;

  // Load library config
  this.configService.getConfig().subscribe({
    next: (config) => {
      this.config = config;
    },
    error: (err) => {
      console.error("Error loading config", err);
    }
  });

  // Load borrowed books
  this.issueService.getMyIssues(userId).subscribe({
    next: (issues) => {
      this.issues = issues;
    },
    error: (err) => {
      console.error("Error loading issues", err);
    }
  });

  // Load fines
  this.fineService.getMyFines(userId).subscribe({
    next: (res) => {
      this.fines = res;
      this.loading = false;
    },
    error: (err) => {
      console.error("Error loading fines", err);
      this.loading = false;
    }
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
  renewBook(issueId: number) {

  this.issueService.renewIssue(issueId).subscribe({

    next: () => {

      alert("✅ Book renewed");

      this.reloadIssues();

    },

    error: (err) => {

      console.error(err);

      alert("❌ Could not renew");

    }

  });

}

returnBook(issueId: number) {
  this.issueService.returnIssue(issueId).subscribe({
    next: () => {
      alert("✅ Book returned successfully");
      this.reloadIssues();
      const user = this.authService.getCurrentUser();
      if (user) {
        this.fineService.getMyFines(user.id).subscribe({
          next: (data) => {
            this.fines = data; // ✅ was: data.issuesWithFines
          }
        });
      }
    },
    error: (err) => {
      console.error(err);
      alert("❌ Error returning book");
    }
  });
}

getSpecificFine(issueId: number) {
  if (!this.fines || !Array.isArray(this.fines)) return null;
  if (this.fines.length > 0) console.log('Fine object shape:', this.fines[0]); // check the key
  return this.fines.find((f: any) => f.issueId === issueId) ?? null;
}

payFine(issueId: number) {
  this.fineService.payFine(issueId).subscribe({
    next: (res: any) => {
      alert(`✅ Fine paid: ₹${res.amountPaid}`);
      const user = this.authService.getCurrentUser();
      if (user) {
        this.fineService.getMyFines(user.id).subscribe({
          next: (data) => {
            this.fines = data; // ✅ was: data.issuesWithFines
          }
        });
      }
    },
    error: (err) => {
      console.error(err);
      alert("❌ Payment failed");
    }
  });
}

reloadIssues() {

  const user = this.authService.getCurrentUser();

  if (!user) return;

  this.issueService.getMyIssues(user.id).subscribe({
    next: (data) => {
      this.issues = data;
    }
  });

}


}