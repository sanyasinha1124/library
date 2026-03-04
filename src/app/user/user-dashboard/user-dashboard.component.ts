import { Component } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';

@Component({
  standalone: true,
  imports: [NgIf, NgClass],
  template: `
  <div class="dashboard">

    <!-- SIDEBAR -->
    <aside class="sidebar">
      <h2>📚 Library</h2>

      <nav>
        <button 
          [ngClass]="{active: active === 'home'}"
          (click)="active = 'home'">Dashboard</button>

        <button 
          [ngClass]="{active: active === 'profile'}"
          (click)="active = 'profile'">My Profile</button>

        <button 
          [ngClass]="{active: active === 'books'}"
          (click)="active = 'books'">Book List</button>

        <button 
          [ngClass]="{active: active === 'borrowed'}"
          (click)="active = 'borrowed'">Borrowed Books</button>

        <button 
          [ngClass]="{active: active === 'fines'}"
          (click)="active = 'fines'">Fines</button>
      </nav>

      <button class="logout" (click)="logout()">Logout</button>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="content">

      <header>
        <h1>Welcome to Your Dashboard</h1>
      </header>

      <!-- DASHBOARD HOME -->
      <section *ngIf="active === 'home'" class="cards">

        <div class="card">
          <h3>📖 Available Books</h3>
          <p>120</p>
        </div>

        <div class="card">
          <h3>📚 Borrowed Books</h3>
          <p>3</p>
        </div>

        <div class="card">
          <h3>💰 Pending Fines</h3>
          <p>₹50</p>
        </div>

      </section>

      <!-- PROFILE -->
      <section *ngIf="active === 'profile'" class="panel">
        <h2>My Profile</h2>
        <p><strong>Name:</strong> User Name</p>
        <p><strong>Email:</strong> user&#64;email.com</p>
        <p><strong>Membership:</strong> Active</p>
      </section>

      <!-- BOOK LIST -->
      <section *ngIf="active === 'books'" class="panel">
        <h2>Book List</h2>
        <ul>
          <li>Atomic Habits</li>
          <li>Clean Code</li>
          <li>Rich Dad Poor Dad</li>
          <li>The Alchemist</li>
        </ul>
      </section>

      <!-- BORROWED -->
      <section *ngIf="active === 'borrowed'" class="panel">
        <h2>Borrowed Books</h2>
        <ul>
          <li>Clean Code (Due: 15 Dec)</li>
          <li>The Alchemist (Due: 20 Dec)</li>
        </ul>
      </section>

      <!-- FINES -->
      <section *ngIf="active === 'fines'" class="panel">
        <h2>Fines</h2>
        <p>You have ₹50 pending fine.</p>
        <button class="pay-btn">Pay Now</button>
      </section>

    </main>
  </div>
  `,
  styles: [`
    * {
      box-sizing: border-box;
    }

    .dashboard {
      display: flex;
      height: 100vh;
      font-family: Arial, sans-serif;
    }

    /* Sidebar */
    .sidebar {
      width: 240px;
      background: #1e293b;
      color: white;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .sidebar h2 {
      text-align: center;
      margin-bottom: 2rem;
    }

    nav {
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
    }

    nav button {
      background: transparent;
      border: none;
      color: #cbd5e1;
      text-align: left;
      padding: 0.6rem;
      border-radius: 6px;
      cursor: pointer;
      transition: 0.3s;
      font-size: 14px;
    }

    nav button:hover {
      background: #334155;
      color: white;
    }

    nav button.active {
      background: #2563eb;
      color: white;
    }

    .logout {
      background: #ef4444;
      border: none;
      padding: 0.7rem;
      border-radius: 6px;
      color: white;
      cursor: pointer;
    }

    /* Main */
    .content {
      flex: 1;
      background: #f1f5f9;
      padding: 2rem;
      overflow-y: auto;
    }

    header {
      margin-bottom: 2rem;
    }

    /* Cards */
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .card {
      background: white;
      padding: 1.5rem;
      border-radius: 10px;
      box-shadow: 0 3px 8px rgba(0,0,0,0.08);
      text-align: center;
    }

    .card h3 {
      margin-bottom: 1rem;
      font-size: 16px;
    }

    .card p {
      font-size: 24px;
      font-weight: bold;
      color: #2563eb;
    }

    /* Panels */
    .panel {
      background: white;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 3px 8px rgba(0,0,0,0.08);
    }

    .panel ul {
      margin-top: 1rem;
      padding-left: 1rem;
    }

    .pay-btn {
      margin-top: 1rem;
      padding: 0.6rem 1rem;
      border: none;
      background: #16a34a;
      color: white;
      border-radius: 6px;
      cursor: pointer;
    }
  `]
})
export class UserDashboardComponent {

  active: string = 'home';

  logout() {
    localStorage.clear();
    location.href = '/login/user';
  }

}