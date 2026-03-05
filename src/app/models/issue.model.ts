import { Book } from './book.model';

export interface Issue {
  id:           number;
  bookId:       number;
  userId:       number;
  issueDate:    string;
  dueDate:      string;
  returnDate:   string | null;
  status:       'issued' | 'overdue' | 'returned';
  renewCount:   number;
  renewalCount: number;
  maxRenewals:  number;
  fine:         number;
  fineAmount:   number;
  finePaid:     boolean;
  daysUntilDue: number;
  isOverdue:    boolean;
  book?:        Pick<Book, 'id' | 'title' | 'author' | 'isbn'>;
}
