import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, TitleCasePipe, DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { BookService } from '../book.service';
import { IssueService } from '../../my-books/issue.service';
import { Book } from '../../models/book.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent, TitleCasePipe, DatePipe],
  templateUrl: './book-detail.component.html'
})
export class BookDetailComponent implements OnInit, OnDestroy {

  book: Book | null = null;
  isLoading = false;
  errorMessage = '';
  borrowMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private issueService: IssueService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        this.isLoading = true;
        this.errorMessage = '';
        this.borrowMessage = '';
        return this.bookService.getById(id);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (book) => {
        this.book = book;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Book not found. ' + (err.error?.error || '');
        this.isLoading = false;
      }
    });
  }

 borrowBook() {

  if (!this.book) return;

  this.issueService.borrowBook(this.book.id).subscribe({

    next: () => {
      alert("Book borrowed successfully!");
    },

    error: (err) => {
      console.error("Borrow error:", err);
      alert(err.error?.error || "Borrow failed");
    }

  });

}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}