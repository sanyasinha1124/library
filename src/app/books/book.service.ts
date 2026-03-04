import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BookService {

  private API = 'http://localhost:3001/api/books';

  constructor(private http: HttpClient) {}

  getAllBooks() {
    return this.http.get<any[]>(this.API);
  }
}