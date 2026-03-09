import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Issue } from '../models/issue.model';

@Injectable({ providedIn: 'root' })
export class IssueService {
  private apiUrl = 'http://localhost:3001/api/issues';

  constructor(private http: HttpClient) {}

  // getMyIssues(): Observable<Issue[]> {
  //   return this.http.get<Issue[]>(this.apiUrl);
  // }

borrowBook(bookId: number) {
  return this.http.post(
    'http://localhost:3001/api/issues',
    { bookId: bookId }
  );
}
 renewIssue(issueId: number) {

  return this.http.post(
    `http://localhost:3001/api/issues/${issueId}/renew`,
    {}
  );

}

returnIssue(issueId: number) {

  return this.http.post(
    `http://localhost:3001/api/issues/${issueId}/return`,
    {}
  );

}
 getMyIssues(userId: number) {
  return this.http.get<any[]>(
    `http://localhost:3001/api/issues/user/${userId}`
  );
}
}
