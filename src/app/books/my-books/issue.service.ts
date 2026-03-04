import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Issue {
  id: number;
  bookTitle: string;
  issueDate: string;
  dueDate: string;
  returned: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  private api = 'http://localhost:8080/api/issues';

  constructor(private http: HttpClient) {}

  // Get logged-in user's issued books
  getMyIssues(): Observable<Issue[]> {
    return this.http.get<Issue[]>(`${this.api}/my`);
  }

  // Return a book
  returnBook(issueId: number): Observable<any> {
    return this.http.post(`${this.api}/return/${issueId}`, {});
  }

}