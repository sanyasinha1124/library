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

      <!-- TITLE -->
      <div class="form-group">
        <label>Title *</label>
        <input type="text" formControlName="title" placeholder="Book title" />

        <div class="error-text"
          *ngIf="bookForm.get('title')?.touched && bookForm.get('title')?.invalid">
          Title is required
        </div>
      </div>

      <!-- DESCRIPTION -->
      <div class="form-group">
        <label>Description *</label>

        <textarea
          formControlName="body"
          rows="4"
          placeholder="Book description">
        </textarea>

        <div class="error-text"
          *ngIf="bookForm.get('body')?.touched && bookForm.get('body')?.invalid">
          Description is required
        </div>
      </div>

      <!-- ISBN -->
      <div class="form-group">
        <label>ISBN</label>
        <input
          type="text"
          formControlName="isbn"
          placeholder="978-..." />
      </div>

      <!-- CATEGORY -->
      <div class="form-group">
        <label>Category</label>
        <input
          type="text"
          formControlName="category"
          placeholder="Fiction / Science" />
      </div>

      <!-- PUBLISHED YEAR -->
      <div class="form-group">
        <label>Published Year</label>

        <input
          type="number"
          formControlName="publishedYear"
          placeholder="2024"
        />
      </div>

      <!-- COPIES -->
      <div class="form-group">
        <label>Total Copies *</label>

        <input
          type="number"
          formControlName="totalCopies"
          placeholder="1"
        />

        <div class="error-text"
          *ngIf="bookForm.get('totalCopies')?.touched && bookForm.get('totalCopies')?.invalid">
          Must be at least 1
        </div>
      </div>

      <!-- MESSAGE -->
      <p *ngIf="message"
        [class.success]="message.includes('✅')"
        [class.error]="!message.includes('✅')">
        {{ message }}
      </p>

      <!-- ACTIONS -->
      <div class="form-actions">

        <button
          type="submit"
          class="primary-btn"
          [disabled]="bookForm.invalid || isLoading">

          {{ isLoading
              ? 'Saving...'
              : (editBook ? 'Update Book' : 'Add Book') }}

        </button>

        <button
          type="button"
          class="secondary-btn"
          *ngIf="editBook"
          (click)="cancelEdit()">

          Cancel

        </button>

      </div>

    </form>

  </div>

</div>
`
})
export class BookFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() editBook: Book | null = null;
  @Output() bookSaved = new EventEmitter<void>();

  bookForm!: FormGroup;
  isLoading = false;
  message = '';

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private bookService: BookService
  ) {}

  ngOnInit(): void {

    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      isbn: [''],
      category: [''],
      publishedYear: [''],
      totalCopies: [1, [Validators.required, Validators.min(1)]]
    });

  }

  ngOnChanges(): void {

    if (this.editBook && this.bookForm) {

      this.bookForm.patchValue({
        title: this.editBook.title,
        body: this.editBook.body,
        isbn: this.editBook.isbn,
        category: this.editBook.category,
        publishedYear: this.editBook.publishedYear,
        totalCopies: this.editBook.totalCopies
      });

    }

  }

  onSubmit(): void {

    if (this.bookForm.invalid) return;

    this.isLoading = true;
    this.message = '';

    const request = this.editBook
      ? this.bookService.update(this.editBook.id, this.bookForm.value)
      : this.bookService.create(this.bookForm.value);

    request.pipe(takeUntil(this.destroy$)).subscribe({

      next: () => {

        this.message = this.editBook
          ? '✅ Book updated successfully!'
          : '✅ Book added successfully!';

        this.isLoading = false;

        this.bookSaved.emit();

        if (!this.editBook) {
          this.bookForm.reset({ totalCopies: 1 });
        }

      },

      error: (err) => {

        this.message =
          '❌ ' + (err.error?.error || 'Failed to save.');

        this.isLoading = false;

      }

    });

  }

  cancelEdit(): void {

    this.editBook = null;
    this.bookForm.reset({ totalCopies: 1 });

  }

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

}