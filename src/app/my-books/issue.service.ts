import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Issue } from '../models/issue.model';

@Injectable({ providedIn: 'root' })
export class IssueService {
  private apiUrl = 'http://localhost:3001/api/issues';

  constructor(private http: HttpClient) {}

  getMyIssues(): Observable<Issue[]> {
    return this.http.get<Issue[]>(this.apiUrl);
  }

  borrowBook(bookId: number): Observable<{ message: string; issue: Issue }> {
    return this.http.post<{ message: string; issue: Issue }>(this.apiUrl, { bookId });
  }

  returnBook(issueId: number): Observable<{ message: string; issue: Issue; fine: number }> {
    return this.http.put<{ message: string; issue: Issue; fine: number }>(
      `${this.apiUrl}/${issueId}/return`, {}
    );
  }

  renewBook(issueId: number): Observable<{ message: string; issue: Issue }> {
    return this.http.put<{ message: string; issue: Issue }>(
      `${this.apiUrl}/${issueId}/renew`, {}
    );
  }
}
