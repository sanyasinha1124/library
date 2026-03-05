export interface Fine {
  issueId:    number;
  bookId:     number;
  book: {
    id:       number;
    title:    string;
    author:   string;
  };
  issueDate:  string;
  dueDate:    string;
  returnDate: string;
  daysOverdue:number;
  fine:       number;
  finePaid:   boolean;
  status:     'active' | 'returned';
}

export interface FinesResponse {
  fines:        Fine[];
  totalFines:   number;
  paidFines:    number;
  pendingFines: number;
}
