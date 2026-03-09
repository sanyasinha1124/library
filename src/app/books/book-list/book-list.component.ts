
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, switchMap } from 'rxjs/operators';
import { BookService } from '../book.service';
import { IssueService } from '../../my-books/issue.service';
import { Book } from '../../models/book.model';
import { BookCardComponent } from '../book-card/book-card.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule, BookCardComponent, LoadingSpinnerComponent, ConfirmDialogComponent],
  templateUrl: './book-list.component.html'
})
export class BookListComponent implements OnInit, AfterViewInit, OnDestroy {

  books: Book[] = [];
  categories: string[] = [];
  selectedCategory = '';
  isLoading = false;
  errorMessage = '';
  showConfirm = false;
  selectedBook: Book | null = null;

  private destroy$ = new Subject<void>();

  @ViewChild('searchInput') searchInputRef!: ElementRef<HTMLInputElement>;

  constructor(
    private bookService: BookService,
    private issueService: IssueService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadCategories();
  }

  ngAfterViewInit(): void {
    // debounce the search input — waits 300ms after user stops typing
    fromEvent<Event>(this.searchInputRef.nativeElement, 'input').pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((event: Event) => {
        const query = (event.target as HTMLInputElement).value.trim();
        this.isLoading = true;
        if (!query && !this.selectedCategory) return this.bookService.getAll();
        if (!query && this.selectedCategory) return this.bookService.getByCategory(this.selectedCategory);
        return this.bookService.search(query);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (books) => { this.books = books; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });

    this.searchInputRef.nativeElement.focus();
  }

  loadBooks(): void {
    this.isLoading = true;
    this.bookService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (books) => { this.books = books; this.isLoading = false; },
      error: () => { this.errorMessage = 'Could not load books.'; this.isLoading = false; }
    });
  }

  loadCategories(): void {
    this.bookService.getCategories().pipe(takeUntil(this.destroy$)).subscribe({
      next: (cats) => this.categories = cats,
      error: () => {}
    });
  }

  // called when category dropdown changes
  filterByCategory(): void {
    this.isLoading = true;
    const query = this.searchInputRef?.nativeElement?.value?.trim() || '';

    let obs;
    if (this.selectedCategory && query) {
      obs = this.bookService.search(query); // search text takes priority
    } else if (this.selectedCategory) {
      obs = this.bookService.getByCategory(this.selectedCategory);
    } else {
      obs = this.bookService.getAll();
    }

    obs.pipe(takeUntil(this.destroy$)).subscribe({
      next: (books) => { this.books = books; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }
onBorrowClicked(book: Book): void {

  this.selectedBook = book;
  this.showConfirm = true;

}


confirmBorrow(): void {

  if (!this.selectedBook) return;

  console.log("Borrow request book:", this.selectedBook);

  this.showConfirm = false;

  this.issueService.borrowBook(this.selectedBook.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {

        alert(`"${this.selectedBook?.title}" borrowed successfully!`);

        this.selectedBook = null;
        this.loadBooks();

      },
      error: (err) => {

        console.error("Borrow error:", err);
        alert(err.error?.error || "Could not borrow book");

      }
    });

}
 cancelBorrow(): void {

  this.showConfirm = false;
  this.selectedBook = null;

}

  trackByBookId(index: number, book: Book): number { return book.id; }
  trackByCat(index: number, cat: string): string { return cat; }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}