import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;

constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {}


  ngOnInit() {
    this.loginForm = this.fb.group({
      rut: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  get rut() {
    return this.loginForm.get('rut')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

async onSubmit() {
  if (this.loginForm.valid) {
    const { rut, password } = this.loginForm.value;

    this.auth.loginUsuario({ rut, password }).subscribe({
      next: (data: any) => {
        this.auth.guardarSesion(data.token, data.user);

        if (data.user.tipo === 'paciente') {
          this.router.navigate(['/home']);
        } else if (data.user.tipo === 'medico') {
          this.router.navigate(['/medico-home']);
        }
      },
      error: () => {
        alert('Rut o contraseña incorrecta');
      }
    });
  }
}
}