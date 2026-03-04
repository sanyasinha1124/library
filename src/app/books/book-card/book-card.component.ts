import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">

      <div class="content">
        <h3>{{ book?.title }}</h3>
        <p class="author">by {{ book?.author }}</p>
        
        <div class="meta">
          <span 
            class="badge"
            [class.available]="book?.availableCopies > 0"
            [class.unavailable]="book?.availableCopies === 0"
          >
            {{ book?.availableCopies > 0 ? 'Available' : 'Out of Stock' }}
          </span>

          <span class="copies">
            {{ book?.availableCopies }} copies
          </span>
        </div>
      </div>

     <button
  class="borrow-btn"
  [disabled]="book?.availableCopies === 0 || borrowDisabled "
  (click)="onBorrow()"
>
  Borrow
</button>
    </div>
  `,
  styles: [`
    .card {
      background: white;
      padding: 1.5rem;
      border-radius: 14px;
      box-shadow: 0 6px 18px rgba(0,0,0,0.06);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: 0.3s ease;
      height: 100%;
    }

    .card:hover {
      transform: translateY(-6px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }

    h3 {
      margin: 0 0 6px 0;
      font-size: 18px;
    }

    .author {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 1rem;
    }

    .meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .badge {
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

    .copies {
      font-size: 12px;
      color: #6b7280;
    }

    .borrow-btn {
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
  `]
})
export class BookCardComponent {
  @Input() borrowDisabled = false;
  @Input() book: any;
  @Output() borrow = new EventEmitter<number>();

  onBorrow() {
    if (this.book?.id) {
      this.borrow.emit(this.book.id);
    }
  }

}