import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../book.service';

@Component({
  standalone: true,
  selector: 'app-book-list',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="page">

    <header class="header">
      <h1>📚 Library Catalogue</h1>
      <p>Discover and borrow your favorite books</p>
    </header>

    <!-- Search -->
    <div class="search-box">
      <input
        type="text"
        [(ngModel)]="search"
        placeholder="Search books by title or author..."
      />
    </div>

    <!-- Loading -->
    <div *ngIf="loading" class="loading">
      Loading books...
    </div>

    <!-- Empty -->
    <div *ngIf="!loading && filteredBooks().length === 0" class="empty">
      No books found.
    </div>

    <!-- Book Grid -->
    <div class="grid">
      <div
        class="card"
        *ngFor="let book of filteredBooks()"
      >
        <div class="card-body">
          <h3>{{ book.title }}</h3>
          <p class="author">by {{ book.author }}</p>

          <span
            class="badge"
            [class.available]="book.availableCopies > 0"
            [class.unavailable]="book.availableCopies === 0"
          >
            {{ book.availableCopies > 0 ? 'Available' : 'Out of Stock' }}
          </span>
        </div>

        <button
          class="borrow-btn"
          [disabled]="book.availableCopies === 0"
          (click)="borrow(book.id)"
        >
          Borrow
        </button>
      </div>
    </div>

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

    .header h1 {
      margin: 0;
      font-size: 28px;
    }

    .header p {
      color: #6b7280;
      margin-top: 4px;
      margin-bottom: 2rem;
    }

    /* Search */
    .search-box {
      margin-bottom: 2rem;
    }

    .search-box input {
      width: 100%;
      padding: 0.8rem 1rem;
      border-radius: 10px;
      border: 1px solid #d1d5db;
      font-size: 14px;
      transition: 0.3s;
    }

    .search-box input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
    }

    /* Grid */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.5rem;
    }

    /* Card */
    .card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: 0.3s;
    }

    .card:hover {
      transform: translateY(-5px);
    }

    .card-body h3 {
      margin: 0 0 6px 0;
    }

    .author {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 10px;
    }

    /* Badge */
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .available {
      background: #dcfce7;
      color: #166534;
    }

    .unavailable {
      background: #fee2e2;
      color: #991b1b;
    }

    /* Button */
    .borrow-btn {
      margin-top: 1rem;
      padding: 0.6rem;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg, #2563eb, #1e3a8a);
      color: white;
      cursor: pointer;
      font-weight: 500;
      transition: 0.3s;
    }

    .borrow-btn:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    .borrow-btn:disabled {
      background: #9ca3af;
      cursor: not-allowed;
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
    }
  `]
})
export class BookListComponent implements OnInit {

  books: any[] = [];
  search = '';
  loading = true;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.getAllBooks().subscribe(res => {
      this.books = res;
      this.loading = false;
    });
  }

  filteredBooks() {
    return this.books.filter(book =>
      book.title.toLowerCase().includes(this.search.toLowerCase()) ||
      book.author.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  borrow(bookId: number) {

  if (this.issues.length >= this.config.library.maxBooksPerUser) {
    alert(`You can only borrow ${this.config.library.maxBooksPerUser} books.`);
    return;
  }

  this.bookService.borrowBook(bookId).subscribe(() => {
    alert('Book borrowed successfully!');
  });

}

}