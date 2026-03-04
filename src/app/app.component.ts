import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  private authService = inject(AuthService);
  user: any = null;
  currentUser$ = this.authService.currentUser$;
  ngOnInit() {
  const token = localStorage.getItem('library_token');
  if (token) {
    this.router.navigate(['/dashboard/user']);
  }
}
  logout() {
    this.authService.logout();
  }
}