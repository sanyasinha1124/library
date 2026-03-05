// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// export interface Book {
//   id: number;
//   title: string;
//   author: string;
//   availableCopies: number;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class BookService {

//   private api = 'http://localhost:8080/api/books';

//   constructor(private http: HttpClient) {}

//   // Get all books
//   getAllBooks(): Observable<Book[]> {
//     return this.http.get<Book[]>(this.api);
//   }

//   // Borrow book
//   borrowBook(bookId: number): Observable<any> {
//     return this.http.post(
//       `http://localhost:8080/api/issues/borrow/${bookId}`,
//       {}
//     );
//   }

// }
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class BookService {
  private apiUrl = 'http://localhost:3001/api/books';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/detailed`).pipe(
      retry(1),
      catchError(err => {
        console.error('Error loading books', err);
        return throwError(() => err);
      })
    );
  }

  getById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/detailed/${id}`);
  }

  search(query: string): Observable<Book[]> {
    let params = new HttpParams();
    if (query) params = params.set('q', query);
    return this.http.get<Book[]>(`${this.apiUrl}/search`, { params });
  }

  getByCategory(category: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/category/${encodeURIComponent(category)}`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories/list`);
  }

  create(book: Partial<Book>): Observable<{ message: string; book: Book }> {
    return this.http.post<{ message: string; book: Book }>(`${this.apiUrl}/create`, book);
  }

  update(id: number, book: Partial<Book>): Observable<{ message: string; book: Book }> {
    return this.http.put<{ message: string; book: Book }>(`${this.apiUrl}/${id}/update`, book);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}/delete`);
  }
}