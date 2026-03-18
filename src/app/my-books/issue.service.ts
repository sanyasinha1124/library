import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Issue } from '../models/issue.model';

@Injectable({ providedIn: 'root' })
export class IssueService {
  private apiUrl = 'http://localhost:3001/api/issues';

  constructor(private http: HttpClient) {}


borrowBook(bookId: number) {
  return this.http.post(
    'http://localhost:3001/api/issues',
    { bookId: bookId }
  );
}
 renewIssue(issueId: number) {

  return this.http.put(
    `http://localhost:3001/api/issues/${issueId}/renew`,
    {}
  );

}



returnIssue(id: number) {
  return this.http.put(`http://localhost:3001/api/issues/${id}/return`, {});
}
 getMyIssues(userId: number) {
  return this.http.get<any[]>(
    `http://localhost:3001/api/issues/user/${userId}`
  );
}
}
