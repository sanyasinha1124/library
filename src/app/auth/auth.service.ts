

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../models/user.model';

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

 private readonly API = 'http://localhost:3001/api/auth';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private tokenKey = 'library_token';

  constructor() {
    this.restoreSession();
  }

  private restoreSession() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.getProfile().subscribe();
    }
  }

  register(data: {
    username: string;
    email: string;
    password: string;
    fullName: string;
  }) {
    return this.http.post<AuthResponse>(`${this.API}/register`, data)
      .pipe(
        tap(res => this.handleAuth(res))
      );
  }

  login(data: { username: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.API}/login`, data)
      .pipe(
        tap(res => this.handleAuth(res))
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  getProfile() {
    return this.http.get<User>(`${this.API}/profile`)
      .pipe(
        tap(user => this.currentUserSubject.next(user))
      );
  }

  private handleAuth(response: AuthResponse) {
    localStorage.setItem(this.tokenKey, response.token);
    this.currentUserSubject.next(response.user);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  isLibrarian(): boolean {
    return this.currentUserSubject.value?.role === 'librarian';
  }
}