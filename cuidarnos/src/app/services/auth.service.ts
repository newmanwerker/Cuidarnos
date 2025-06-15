import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //private apiUrl = 'http://localhost:3000/api';
  private apiUrl = 'https://cuidarnos.up.railway.app/api';

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
  const raw = localStorage.getItem('userData');
  if (!raw) return null;

  const parsed = JSON.parse(raw);

  // Retorna directamente el objeto paciente o medico
  return parsed.paciente || parsed.medico || null;
}

logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  localStorage.removeItem('auth');
  localStorage.removeItem('paciente');
  localStorage.removeItem('medico');
  localStorage.removeItem('userData');
}

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}