

// import { Injectable, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject, tap } from 'rxjs';
// import { User } from '../models/user.model';

// interface AuthResponse {
//   token: string;
//   user: User;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   private http = inject(HttpClient);

//  private readonly API = 'http://localhost:3001/api/auth';

//   private currentUserSubject = new BehaviorSubject<User | null>(null);
//   currentUser$ = this.currentUserSubject.asObservable();

//   private tokenKey = 'library_token';

//   constructor() {
//     this.restoreSession();
//   }

//   private restoreSession() {
//     const token = localStorage.getItem(this.tokenKey);
//     if (token) {
//       this.getProfile().subscribe();
//     }
//   }

//   register(data: {
//     username: string;
//     email: string;
//     password: string;
//     fullName: string;
//   }) {
//     return this.http.post<AuthResponse>(`${this.API}/register`, data)
//       .pipe(
//         tap(res => this.handleAuth(res))
//       );
//   }

//   login(data: { username: string; password: string }) {
//     return this.http.post<AuthResponse>(`${this.API}/login`, data)
//       .pipe(
//         tap(res => this.handleAuth(res))
//       );
//   }

//   logout() {
//     localStorage.removeItem(this.tokenKey);
//     this.currentUserSubject.next(null);
//   }

//   getProfile() {
//     return this.http.get<User>(`${this.API}/profile`)
//       .pipe(
//         tap(user => this.currentUserSubject.next(user))
//       );
//   }

//   private handleAuth(response: AuthResponse) {
//     localStorage.setItem(this.tokenKey, response.token);
//     this.currentUserSubject.next(response.user);
//   }

//   getToken(): string | null {
//     return localStorage.getItem(this.tokenKey);
//   }

//   isLoggedIn(): boolean {
//     return !!this.currentUserSubject.value;
//   }

//   isLibrarian(): boolean {
//     return this.currentUserSubject.value?.role === 'librarian';
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3001/api/auth';

  // This is like a variable that tells everyone who is logged in
  currentUser$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {
    // When the app starts, check if someone was already logged in
    this.restoreSession();
  }

  restoreSession() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUser$.next(user);
      } catch {
        this.logout();
      }
    }
  }

  login(username: string, password: string): Observable<{ message: string; token: string; user: User }> {
    return this.http.post<{ message: string; token: string; user: User }>(
      `${this.apiUrl}/login`, { username, password }
    ).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUser$.next(response.user);
      })
    );
  }

  register(data: { username: string; password: string; email: string; fullName?: string }): Observable<{ message: string; token: string; user: User }> {
    return this.http.post<{ message: string; token: string; user: User }>(
      `${this.apiUrl}/register`, data
    ).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUser$.next(response.user);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser$.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  getCurrentUser(): User | null {
  return this.currentUser$.getValue();
}
  isLibrarian(): boolean {
    const user = this.currentUser$.getValue();
    return user?.role === 'librarian';
  }
}
