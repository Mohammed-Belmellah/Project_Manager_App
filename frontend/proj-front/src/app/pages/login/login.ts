import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../services/auth'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html', 
  styleUrl: './login.css'      
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';

 onLogin() {
    const credentials = { email: this.email, password: this.password };
    
    this.authService.login(credentials).subscribe({
      next: (res: any) => {
        console.log('Login Success:', res);

        if (res.access_token) {
            localStorage.setItem('token', res.access_token); 
            if (res.refresh_token) {
                localStorage.setItem('refresh_token', res.refresh_token);
            }
            
            this.router.navigate(['/projects']); 
        }
      },
      error: (err: any) => {
        console.error('Login Error:', err);
        this.errorMessage = 'Invalid email or password';
      }
    });
  }
}