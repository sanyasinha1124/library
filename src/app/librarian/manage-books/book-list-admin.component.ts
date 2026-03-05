import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BookService } from '../../books/book.service';
import { Book } from '../../models/book.model';
import { BookFormComponent } from './book-form.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner.component';

@Component({
  selector: 'app-book-list-admin',
  standalone: true,
  imports: [CommonModule, BookFormComponent, LoadingSpinnerComponent],
  template: `
<div class="admin-wrapper">

  <!-- Header -->
  <div class="admin-header">
    <div>
      <h1>Library Management</h1>
      <p>Manage your library books and inventory</p>
    </div>

    <div class="stat-card">
      <span>Total Books</span>
      <strong>{{ books.length }}</strong>
    </div>
  </div>

  <!-- Book Form -->
  <div class="card">
    <app-book-form
      [editBook]="editingBook"
      (bookSaved)="loadBooks()"
    ></app-book-form>
  </div>

  <!-- Table -->
  <div class="card">

    <div class="table-header">
      <h2>Library Collection</h2>
    </div>

    <app-loading-spinner [isLoading]="isLoading"></app-loading-spinner>

    <table *ngIf="!isLoading && books.length > 0" class="table">

      <thead>
        <tr>
          <th>Title</th>
          <th>Category</th>
          <th>Total</th>
          <th>Available</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>

        <tr *ngFor="let book of books; trackBy: trackById">

          <td class="title">
            {{ book.title }}
          </td>

          <td>
            <span class="badge">
              {{ book.category }}
            </span>
          </td>

          <td>{{ book.totalCopies }}</td>

          <td>
            <span
              class="stock"
              [class.low]="book.availableCopies <= 1"
            >
              {{ book.availableCopies }}
            </span>
          </td>

          <td class="actions">

            <button
              class="btn btn-edit"
              (click)="startEdit(book)"
            >
              Edit
            </button>

            <button
              class="btn btn-delete"
              (click)="deleteBook(book)"
            >
              Delete
            </button>

          </td>

        </tr>

      </tbody>

    </table>

    <div *ngIf="!isLoading && books.length === 0" class="empty">
      No books available
    </div>

  </div>

</div>
<style>
  .admin-wrapper{
  padding:40px;
  background:#f6f8fb;
  min-height:100vh;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
}

/* HEADER */

.admin-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:30px;
}

.admin-header h1{
  margin:0;
  font-size:26px;
  font-weight:600;
  color:#111827;
}

.admin-header p{
  margin-top:4px;
  color:#64748b;
  font-size:14px;
}

/* STAT CARD */

.stat-card{
  background:#ffffff;
  border:1px solid #e5e7eb;
  border-radius:12px;
  padding:12px 20px;
  text-align:center;
  box-shadow:0 3px 10px rgba(0,0,0,0.04);
}

.stat-card span{
  font-size:12px;
  color:#6b7280;
}

.stat-card strong{
  display:block;
  font-size:20px;
  margin-top:4px;
  color:#111827;
}

/* CARD */

.card{
  background:white;
  border-radius:12px;
  padding:25px;
  margin-bottom:25px;
  border:1px solid #e5e7eb;
  box-shadow:0 4px 14px rgba(0,0,0,0.05);
}

/* TABLE HEADER */

.table-header{
  margin-bottom:15px;
}

.table-header h2{
  margin:0;
  font-size:18px;
  color:#111827;
}

/* TABLE */

.table{
  width:100%;
  border-collapse:collapse;
}

.table thead{
  background:#f1f5f9;
}

.table th{
  padding:12px;
  font-size:13px;
  text-align:left;
  color:#475569;
  font-weight:600;
  border-bottom:1px solid #e5e7eb;
}

.table td{
  padding:14px 12px;
  border-bottom:1px solid #f1f5f9;
  font-size:14px;
}

.table tr:hover{
  background:#f9fafb;
}

/* CATEGORY BADGE */

.badge{
  background:#e0f2fe;
  color:#0369a1;
  padding:4px 10px;
  border-radius:20px;
  font-size:12px;
}

/* STOCK */

.stock{
  font-weight:600;
  color:#10b981;
}

.stock.low{
  color:#ef4444;
}

/* ACTIONS */

.actions{
  display:flex;
  gap:8px;
}

/* BUTTONS */

.btn{
  border:none;
  padding:6px 14px;
  font-size:13px;
  border-radius:6px;
  cursor:pointer;
  font-weight:500;
  transition:all .2s ease;
}

.btn-edit{
  background:#3b82f6;
  color:white;
}

.btn-edit:hover{
  background:#2563eb;
}

.btn-delete{
  background:#ef4444;
  color:white;
}

.btn-delete:hover{
  background:#dc2626;
}

/* EMPTY */

.empty{
  text-align:center;
  padding:30px;
  color:#6b7280;
}
</style>
`
})
export class BookListAdminComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  editingBook: Book | null = null;
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(private bookService: BookService) {}

  ngOnInit(): void { this.loadBooks(); }

  loadBooks(): void {
    this.isLoading = true;
    this.editingBook = null;
    this.bookService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (books) => { this.books = books; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  startEdit(book: Book): void {
    this.editingBook = { ...book };
    window.scrollTo(0, 0);
  }

  deleteBook(book: Book): void {
    if (!confirm('Delete "' + book.title + '"?')) return;
    this.bookService.delete(book.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => this.loadBooks(),
      error: (err) => alert('❌ ' + (err.error?.error || 'Cannot delete.'))
    });
  }

  trackById(index: number, book: Book): number { return book.id; }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
