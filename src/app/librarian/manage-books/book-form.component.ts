import { Component, Input, OnInit, OnDestroy, OnChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BookService } from '../../books/book.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
template: `
<div class="form-wrapper">

  <div class="book-form-card">

    <h3>{{ editBook ? 'Edit Book' : 'Add New Book' }}</h3>

    <form [formGroup]="bookForm" (ngSubmit)="onSubmit()">

      <div class="form-group">
        <label>Title *</label>
        <input type="text" formControlName="title" placeholder="Book title"/>
        <div class="error-text" *ngIf="bookForm.get('title')?.touched && bookForm.get('title')?.invalid">
          Title is required
        </div>
      </div>

      <div class="form-group">
        <label>Description *</label>
        <textarea formControlName="body" rows="3" placeholder="Book description"></textarea>
        <div class="error-text" *ngIf="bookForm.get('body')?.touched && bookForm.get('body')?.invalid">
          Description is required
        </div>
      </div>

      <div class="form-group">
        <label>ISBN</label>
        <input type="text" formControlName="isbn" placeholder="978-..." />
      </div>

      <div class="form-group">
        <label>Category</label>
        <input type="text" formControlName="category" placeholder="Fiction / Science" />
      </div>

      <div class="form-group">
        <label>Total Copies *</label>
        <input type="number" formControlName="totalCopies" placeholder="1" />
        <div class="error-text" *ngIf="bookForm.get('totalCopies')?.touched && bookForm.get('totalCopies')?.invalid">
          Must be at least 1
        </div>
      </div>

      <p *ngIf="message"
        [class.success]="message.includes('✅')"
        [class.error]="!message.includes('✅')">
        {{ message }}
      </p>

      <div class="form-actions">

        <button
          type="submit"
          class="primary-btn"
          [disabled]="bookForm.invalid || isLoading"
        >
          {{ isLoading ? 'Saving...' : (editBook ? 'Update Book' : 'Add Book') }}
        </button>

        <button
          type="button"
          class="secondary-btn"
          *ngIf="editBook"
          (click)="cancelEdit()"
        >
          Cancel
        </button>

      </div>

    </form>

  </div>

</div>
<style>
    .form-wrapper{
  width:100%;
  display:flex;
  justify-content:center;
  margin-top:30px;
}

.book-form-card{
  width:100%;
  max-width:700px;
  background:white;
  padding:30px;
  border-radius:12px;
  box-shadow:0 8px 20px rgba(0,0,0,0.05);
}

.book-form-card h3{
  margin-bottom:20px;
  font-size:22px;
}

.form-group{
  margin-bottom:16px;
  display:flex;
  flex-direction:column;
}

.form-group label{
  font-size:14px;
  margin-bottom:6px;
  color:#475569;
}

.form-group input,
.form-group textarea{
  padding:10px;
  border:1px solid #e2e8f0;
  border-radius:6px;
  font-size:14px;
  transition:0.2s;
}

.form-group input:focus,
.form-group textarea:focus{
  border-color:#3b82f6;
  outline:none;
}

.error-text{
  font-size:12px;
  color:#dc2626;
  margin-top:4px;
}

.form-actions{
  display:flex;
  gap:10px;
  margin-top:10px;
}

.primary-btn{
  background:#2563eb;
  color:white;
  border:none;
  padding:10px 16px;
  border-radius:6px;
  cursor:pointer;
}

.secondary-btn{
  background:#e2e8f0;
  border:none;
  padding:10px 16px;
  border-radius:6px;
  cursor:pointer;
}

.primary-btn:hover{
  background:#1d4ed8;
}

.secondary-btn:hover{
  background:#cbd5f5;
}

.success{
  color:#16a34a;
}

.error{
  color:#dc2626;
}
</style>
`
})
export class BookFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() editBook: Book | null = null;
  @Output() bookSaved = new EventEmitter<void>();

  bookForm!: FormGroup;
  isLoading = false;
  message = '';
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private bookService: BookService) {}

  ngOnInit(): void {
    this.bookForm = this.fb.group({
      title:       ['', Validators.required],
      body:        ['', Validators.required],
      isbn:        [''],
      category:    [''],
      totalCopies: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnChanges(): void {
    if (this.editBook && this.bookForm) {
      this.bookForm.patchValue({
        title:       this.editBook.title,
        body:        this.editBook.body,
        isbn:        this.editBook.isbn,
        category:    this.editBook.category,
        totalCopies: this.editBook.totalCopies
      });
    }
  }

  onSubmit(): void {
    if (this.bookForm.invalid) return;
    this.isLoading = true;
    this.message = '';

    const obs = this.editBook
      ? this.bookService.update(this.editBook.id, this.bookForm.value)
      : this.bookService.create(this.bookForm.value);

    obs.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.message = this.editBook ? '✅ Book updated!' : '✅ Book added!';
        this.isLoading = false;
        this.bookSaved.emit();
        if (!this.editBook) this.bookForm.reset({ totalCopies: 1 });
      },
      error: (err) => {
        this.message = '❌ ' + (err.error?.error || 'Failed.');
        this.isLoading = false;
      }
    });
  }

  cancelEdit(): void {
    this.editBook = null;
    this.bookForm.reset({ totalCopies: 1 });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
