// import { Routes } from '@angular/router';
// import { authGuard } from './core/auth.guard';
// import { roleGuard } from './core/role.guard';

// export const routes: Routes = [

//   {
//     path: 'login/:type',
//     loadComponent: () =>
//       import('./auth/login/login.component')
//         .then(m => m.LoginComponent)
//   },

//   {
//     path: 'register/:type',
//     loadComponent: () =>
//       import('./auth/register/register.component')
//         .then(m => m.RegisterComponent)
//   },

//   // ✅ USER DASHBOARD (ONLY ONE DEFINITION)
//   {
//   path: 'dashboard/user',
//   canActivate: [authGuard],
//   loadComponent: () =>
//     import('./user/user-dashboard/user-dashboard.component')
//       .then(m => m.UserDashboardComponent),
//   children: [

//     { path: '', redirectTo: 'overview', pathMatch: 'full' },

//     // {
//     //   path: 'overview',
//     //   loadComponent: () =>
//     //     import('./user/overview/overview.component')
//     //       .then(m => m.OverviewComponent)
//     // },

//     {
//       path: 'my-books',
//       loadComponent: () =>
//         import('./my-books/my-books.component')
//           .then(m => m.MyBooksComponent)
//     },

//     // {
//     //   path: 'favourites',
//     //   loadComponent: () =>
//     //     import('./user/favourites/favourites.component')
//     //       .then(m => m.FavouritesComponent)
//     // },

//     {
//       path: 'fines',
//       loadComponent: () =>
//         import('./user/fines/fines.component')
//           .then(m => m.FinesComponent)
//     },

//     {
//       path: 'profile',
//       loadComponent: () =>
//         import('./user/profile/profile.component')
//           .then(m => m.ProfileComponent)
//     }
//   ]
// },
//   // ✅ LIBRARIAN DASHBOARD
//   {
//     path: 'dashboard/librarian',
//     canActivate: [authGuard, roleGuard('librarian')],
//     loadComponent: () =>
//       import('./librarian/librarian-dashboard/librarian-dashboard.component')
//         .then(m => m.LibrarianDashboardComponent)
//   },

//   {
//     path: '',
//     redirectTo: 'login/user',
//     pathMatch: 'full'
//   },

//   {
//     path: '**',
//     redirectTo: 'login/user'
//   }

// ];
import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'books',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'books',
    loadChildren: () => import('./books/books.routes').then(m => m.BOOKS_ROUTES)
  },
  // {
  //   path: 'my-books',
  //   canActivate: [authGuard],
  //   loadComponent: () => import('./my-books/my-books.component').then(m => m.MyBooksComponent)
  // },
  {
  path: 'my-books',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./my-books/my-books.component')
      .then(m => m.MyBooksComponent)
},
  {
    path: 'librarian',
    loadChildren: () => import('./librarian/librarian.routes').then(m => m.LIBRARIAN_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'books'
  }
];
