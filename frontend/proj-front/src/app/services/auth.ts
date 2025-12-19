import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http'; // Import HttpBackend
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private handler = inject(HttpBackend); // Raw backend handler
  private httpBypass = new HttpClient(this.handler); // Client that ignores interceptors
  private router = inject(Router);

  private apiUrl = 'http://localhost:8083/api/auth'; 
  private tokenKey = 'token';
  private refreshTokenKey = 'refresh_token'; // New key

  login(credentials: {email: string, password: string}) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

  // Helper to get the stored refresh token
  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey);
  }

  // The Refresh Logic
  refreshToken() {
    const refreshToken = this.getRefreshToken();
    
    // Match your Backend DTO: { "token": "..." }
    const body = { token: refreshToken };

    // Use httpBypass so this request doesn't get intercepted!
    return this.httpBypass.post<any>(`${this.apiUrl}/refresh`, body).pipe(
      tap(response => {
        // Save the new Access Token
        if (response.access_token) {
            localStorage.setItem(this.tokenKey, response.access_token);
        }
        // Save the new Refresh Token (if backend rotated it)
        if (response.refresh_token) {
            localStorage.setItem(this.refreshTokenKey, response.refresh_token);
        }
      })
    );
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']); // Redirect to login
  }
}