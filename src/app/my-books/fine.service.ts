import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FineService {
  private apiUrl = 'http://localhost:3001/api/fines';

  constructor(private http: HttpClient) {}

getMyFines(userId: number) {

  return this.http.get<any>(
    `http://localhost:3001/api/fines/user/${userId}`
  );

}

payFine(issueId: number) {

  return this.http.post(
    `http://localhost:3001/api/fines/${issueId}/pay`,
    {}
  );

}

calculateFine(issueId: number) {

  return this.http.get(
    `http://localhost:3001/api/fines/calculate/${issueId}`
  );

}
}
