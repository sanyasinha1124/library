import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Fine {
  id: number;
  amount: number;
  reason: string;
  paid: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class FineService {

  private api = 'http://localhost:8080/api/fines';

  constructor(private http: HttpClient) {}

  // Get all fines for logged-in user
  getMyFines(): Observable<Fine[]> {
    return this.http.get<Fine[]>(`${this.api}/my`);
  }

  // Pay fine
  payFine(fineId: number): Observable<any> {
    return this.http.post(`${this.api}/pay/${fineId}`, {});
  }

  // Get total pending fine amount
  getTotalPending(): Observable<number> {
    return this.http.get<number>(`${this.api}/total-pending`);
  }

}