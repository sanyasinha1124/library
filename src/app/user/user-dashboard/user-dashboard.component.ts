import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
  <div class="dashboard">

    <aside class="sidebar">
      <h2>📚 Library</h2>

      <nav>
        <a routerLink="borrowed" routerLinkActive="active">Borrowed</a>
        <a routerLink="profile" routerLinkActive="active">Profile</a>
        <a routerLink="books" routerLinkActive="active">Books</a>
        <a routerLink="fines" routerLinkActive="active">Fines</a>
        
      </nav>

      <button class="logout" (click)="logout()">Logout</button>
    </aside>

    <main class="content">
      <router-outlet></router-outlet>
    </main>

  </div>
  `,
  styles: [`
    .dashboard { display:flex; height:100vh; }
    .sidebar { width:240px; background:#1e293b; color:white; padding:20px; }
    .sidebar nav { display:flex; flex-direction:column; gap:10px; }
    .sidebar a { color:#cbd5e1; text-decoration:none; padding:8px; border-radius:6px; }
    .sidebar a.active { background:#2563eb; color:white; }
    .content { flex:1; padding:30px; background:#f1f5f9; }
  `]
})
export class UserDashboardComponent {

  logout() {
    localStorage.clear();
    location.href = '/login/user';
  }

}