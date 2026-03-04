import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LibraryConfig {
  library: {
    name: string;
    maxBooksPerUser: number;
    issueDurationDays: number;
    maxRenewals: number;
    renewalExtensionDays: number;
  };
  fines: {
    enabled: boolean;
    perDayRate: number;
    maxFinePerBook: number;
    gracePeriodDays: number;
  };
  roles: any;
}

@Injectable({
  providedIn: 'root'
})
export class LibraryConfigService {

  private api = 'http://localhost:8080/api/config';

  constructor(private http: HttpClient) {}

  getConfig(): Observable<LibraryConfig> {
    return this.http.get<LibraryConfig>(this.api);
  }

}