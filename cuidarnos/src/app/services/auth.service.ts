import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // Cambia al endpoint real del backend

  constructor(private http: HttpClient) {}

  crearAdmin(data: any) {
    return this.http.post(`${this.apiUrl}/admin`, data);
  }

  login(data: any) {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }
}