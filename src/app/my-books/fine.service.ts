import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FineService {
  private apiUrl = 'http://localhost:3001/api/fines';

  constructor(private http: HttpClient) {}

  getMyFines(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }

  payFine(issueId: number): Observable<{ message: string; amountPaid: number }> {
    return this.http.post<{ message: string; amountPaid: number }>(
      `${this.apiUrl}/${issueId}/pay`, {}
    );
  }
}
