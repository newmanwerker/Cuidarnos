import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://cuidarnos.up.railway.app/api'; // Cambia al endpoint real del backend

  constructor(private http: HttpClient) {}

  crearAdmin(data: any) {
    return this.http.post(`${this.apiUrl}/admin`, data);
  }

  login(data: any) {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }

   loginUsuario(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  guardarSesion(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsuario(): any {
    const raw = localStorage.getItem('usuario');
    return raw ? JSON.parse(raw) : null;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}