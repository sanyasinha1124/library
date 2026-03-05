// import { Component, inject } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Router, ActivatedRoute, RouterLink } from '@angular/router';
// import { NgIf } from '@angular/common';
// import { AuthService } from '../auth.service';

// @Component({
//   standalone: true,
//   imports: [FormsModule, NgIf,RouterLink],
//   template: `
//     <div class="container">

//       <div class="card">

//         <h2>{{ loginType === 'librarian' ? 'Librarian Login' : 'User Login' }}</h2>

//         <form #f="ngForm" (ngSubmit)="submit(f)">

//           <div class="field">
//             <input
//               type="text"
//               name="username"
//               [(ngModel)]="username"
//               required
//               minlength="3"
//               placeholder="Username"
//               #usernameCtrl="ngModel"
//             />
//             <small *ngIf="usernameCtrl.invalid && usernameCtrl.touched">
//               Minimum 3 characters required
//             </small>
//           </div>

//           <div class="field">
//             <input
//               type="password"
//               name="password"
//               [(ngModel)]="password"
//               required
//               minlength="6"
//               placeholder="Password"
//               #passwordCtrl="ngModel"
//             />
//             <small *ngIf="passwordCtrl.invalid && passwordCtrl.touched">
//               Minimum 6 characters required
//             </small>
//           </div>

//           <button [disabled]="f.invalid">
//             Login as {{ loginType }}
//           </button>

//           <p class="switch">
//             Switch to
//             <a
//               [routerLink]="['/login', loginType === 'user' ? 'librarian' : 'user']">
//               {{ loginType === 'user' ? 'Librarian' : 'User' }} Login
//             </a>
//           </p>

//           <p class="error" *ngIf="error">{{ error }}</p>

//         </form>
//       </div>

//     </div>
//   `,
//   styles: [`
//     .container {
//       height: 100vh;
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       background: linear-gradient(135deg, #1e3c72, #2a5298);
//     }

//     .card {
//       width: 380px;
//       padding: 2rem;
//       background: white;
//       border-radius: 12px;
//       box-shadow: 0 10px 25px rgba(0,0,0,0.2);
//     }

//     h2 {
//       text-align: center;
//       margin-bottom: 1.5rem;
//     }

//     .field {
//       margin-bottom: 1rem;
//       display: flex;
//       flex-direction: column;
//     }

//     input {
//       padding: 0.7rem;
//       border-radius: 6px;
//       border: 1px solid #ccc;
//       transition: 0.3s;
//     }

//     input:focus {
//       border-color: #1e3c72;
//       outline: none;
//     }

//     small {
//       color: red;
//       font-size: 12px;
//     }

//     button {
//       width: 100%;
//       padding: 0.8rem;
//       border: none;
//       border-radius: 6px;
//       background: #1e3c72;
//       color: white;
//       font-weight: 600;
//       cursor: pointer;
//       margin-top: 0.5rem;
//     }

//     button:disabled {
//       background: gray;
//       cursor: not-allowed;
//     }

//     .switch {
//       text-align: center;
//       margin-top: 1rem;
//     }

//     .error {
//       color: red;
//       text-align: center;
//       margin-top: 1rem;
//     }
//   `]
// })
// export class LoginComponent {

//   private auth = inject(AuthService);
//   private router = inject(Router);
//   private route = inject(ActivatedRoute);

//   loginType = 'user';

//   username = '';
//   password = '';
//   error: string | null = null;

//  constructor() {
//   this.route.params.subscribe(params => {
//     this.loginType = params['type'] || 'user';
//   });
// }

//  submit(form: any) {
//   if (form.invalid) return;

//   this.auth.login({
//     username: this.username,
//     password: this.password
//   }).subscribe({
//     next: (res: any) => {

//       const role = res.user.role;

//       if (role === 'librarian') {
//         this.router.navigate(['/dashboard/librarian']);
//       } else {
//         this.router.navigate(['/dashboard/user']);
//       }

//     },
//     error: () => this.error = 'Invalid credentials'
//   });
// }
// }
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/books']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Login failed please try again.';
      }
    });
  }
}
