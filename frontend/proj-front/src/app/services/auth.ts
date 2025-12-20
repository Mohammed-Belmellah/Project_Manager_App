import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private handler = inject(HttpBackend); 
  private httpBypass = new HttpClient(this.handler); 
  private router = inject(Router);

  private apiUrl = 'http://localhost:8083/api/auth'; 
  private tokenKey = 'token';
  private refreshTokenKey = 'refresh_token';

  login(credentials: {email: string, password: string}) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }
  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey);
  }
  refreshToken() {
    const refreshToken = this.getRefreshToken();
    const body = { token: refreshToken };


    return this.httpBypass.post<any>(`${this.apiUrl}/refresh`, body).pipe(
      tap(response => {
       
        if (response.access_token) {
            localStorage.setItem(this.tokenKey, response.access_token);
        }
        if (response.refresh_token) {
            localStorage.setItem(this.refreshTokenKey, response.refresh_token);
        }
      })
    );
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']); 
  }
}