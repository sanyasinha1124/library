// import { Component, inject } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { NgIf } from '@angular/common';
// import { AuthService } from '../auth.service';

// @Component({
//   standalone: true,
//   imports: [FormsModule, NgIf],
//   template: `
//     <div class="auth-container">
//       <form #f="ngForm" (ngSubmit)="submit(f)" class="auth-form">

//         <h2>Register</h2>

//         <!-- Username -->
//         <div class="form-group">
//           <input
//             type="text"
//             name="username"
//             [(ngModel)]="username"
//             required
//             minlength="3"
//             #usernameCtrl="ngModel"
//             placeholder="Username"
//           />
//           <small *ngIf="usernameCtrl.invalid && usernameCtrl.touched">
//             Username must be at least 3 characters
//           </small>
//         </div>

//         <!-- Email -->
//         <div class="form-group">
//           <input
//             type="email"
//             name="email"
//             [(ngModel)]="email"
//             required
//             email
//             #emailCtrl="ngModel"
//             placeholder="Email"
//           />
//           <small *ngIf="emailCtrl.invalid && emailCtrl.touched">
//             Enter a valid email address
//           </small>
//         </div>

//         <!-- Full Name -->
//         <div class="form-group">
//           <input
//             type="text"
//             name="fullName"
//             [(ngModel)]="fullName"
//             required
//             #nameCtrl="ngModel"
//             placeholder="Full Name"
//           />
//           <small *ngIf="nameCtrl.invalid && nameCtrl.touched">
//             Full name is required
//           </small>
//         </div>

//         <!-- Password -->
//         <div class="form-group">
//           <input
//             type="password"
//             name="password"
//             [(ngModel)]="password"
//             required
//             minlength="6"
//             #passwordCtrl="ngModel"
//             placeholder="Password"
//           />
//           <small *ngIf="passwordCtrl.invalid && passwordCtrl.touched">
//             Password must be at least 6 characters
//           </small>
//         </div>

//         <button [disabled]="f.invalid">Register</button>

//         <p class="error" *ngIf="error">
//           {{ error }}
//         </p>

//       </form>
//     </div>
//   `,
//   styles: [`
//     .auth-container {
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       height: 100vh;
//       background: #f4f6f8;
//     }

//     .auth-form {
//       width: 380px;
//       padding: 2rem;
//       background: white;
//       border-radius: 8px;
//       box-shadow: 0 4px 10px rgba(0,0,0,0.1);
//       display: flex;
//       flex-direction: column;
//       gap: 1rem;
//     }

//     h2 {
//       text-align: center;
//     }

//     .form-group {
//       display: flex;
//       flex-direction: column;
//     }

//     input {
//       padding: 0.6rem;
//       border: 1px solid #ccc;
//       border-radius: 4px;
//     }

//     input:focus {
//       outline: none;
//       border-color: #1976d2;
//     }

//     small {
//       color: red;
//       font-size: 12px;
//       margin-top: 4px;
//     }

//     button {
//       padding: 0.7rem;
//       border: none;
//       background: #2e7d32;
//       color: white;
//       border-radius: 4px;
//       cursor: pointer;
//     }

//     button:disabled {
//       background: #aaa;
//       cursor: not-allowed;
//     }

//     .error {
//       color: red;
//       text-align: center;
//     }
//   `]
// })
// export class RegisterComponent {

//   private authService = inject(AuthService);
//   private router = inject(Router);

//   username = '';
//   email = '';
//   fullName = '';
//   password = '';
//   error: string | null = null;

//   submit(form: any) {
//     if (form.invalid) return;

//     this.authService.register({
//       username: this.username,
//       email: this.email,
//       password: this.password,
//       fullName: this.fullName
//     }).subscribe({
//       next: () => this.router.navigate(['/']),
//       error: () => this.error = 'Registration failed'
//     });
//   }
// }
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  username = '';
  password = '';
  email = '';
  fullName = '';
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register({
      username: this.username,
      password: this.password,
      email: this.email,
      fullName: this.fullName
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/books']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Registration failed.';
      }
    });
  }
}
