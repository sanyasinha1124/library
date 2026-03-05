import { Routes } from '@angular/router';
import { authGuard } from '../auth/guards/auth.guard';
import { librarianGuard } from '../auth/guards/librarian.guard';

export const LIBRARIAN_ROUTES: Routes = [
  {
    path: 'dashboard',
    canActivate: [authGuard, librarianGuard],
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'books',
    canActivate: [authGuard, librarianGuard],
    loadComponent: () => import('./manage-books/book-list-admin.component').then(m => m.BookListAdminComponent)
  },
  {
    path: 'users',
    canActivate: [authGuard, librarianGuard],
    loadComponent: () => import('./manage-users/user-list.component').then(m => m.UserListComponent)
  }
];
