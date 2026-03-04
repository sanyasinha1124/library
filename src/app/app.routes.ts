// import { Routes } from '@angular/router';

// export const routes: Routes = [

// //   {
// //     path: '',
// //     loadChildren: () =>
// //       import('./books/books.routes').then(m => m.BOOKS_ROUTES)
// //   },

// //   {
// //     path: 'auth',
// //     loadChildren: () =>
// //       import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
// //   },

// //   {
// //     path: 'my-books',
// //     loadChildren: () =>
// //       import('./my-books/my-books.routes').then(m => m.MY_BOOKS_ROUTES)
// //   },

// //   {
// //     path: 'librarian',
// //     loadChildren: () =>
// //       import('./librarian/librarian.routes').then(m => m.LIBRARIAN_ROUTES)
// //   },

//   {
//     path: '**',
//     redirectTo: ''
//   },
//    {
//     path: 'login',
//     loadComponent: () =>
//       import('./auth/login/login.component').then(m => m.LoginComponent)
//   },
//   {
//     path: 'register',
//     loadComponent: () =>
//       import('./auth/register/register.component').then(m => m.RegisterComponent)
//   }
// ];
import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { roleGuard } from './core/role.guard';

export const routes: Routes = [

  {
    path: 'login/:type',
    loadComponent: () =>
      import('./auth/login/login.component').then(m => m.LoginComponent)
  },

  {
    path: 'register/:type',
    loadComponent: () =>
      import('./auth/register/register.component').then(m => m.RegisterComponent)
  },
   {
    path: 'dashboard/user',
    loadComponent: () =>
      import('./user/user-dashboard/user-dashboard.component')
        .then(m => m.UserDashboardComponent)
  },

  {
    path: 'dashboard/librarian',
    loadComponent: () =>
      import('./librarian/librarian-dashboard/librarian-dashboard.component')
        .then(m => m.LibrarianDashboardComponent)
  },
  {
  path: 'dashboard/user',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./user/user-dashboard/user-dashboard.component')
      .then(m => m.UserDashboardComponent),
 
},
{
  path: 'dashboard/librarian',
  canActivate: [authGuard, roleGuard('librarian')],
  loadComponent: () =>
    import('./librarian/librarian-dashboard/librarian-dashboard.component')
      .then(m => m.LibrarianDashboardComponent)
},

  {
    path: '',
    redirectTo: 'login/user',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'login/user'
  }

];