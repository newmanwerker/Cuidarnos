import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      nombre: ['', Validators.required],
      rut: ['', Validators.required]
    });
  }

  get nombre() {
    return this.loginForm.get('nombre')!;
  }

  get rut() {
    return this.loginForm.get('rut')!;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { nombre, rut } = this.loginForm.value;
      console.log('Enviando login con:', nombre, rut);

      this.authService.login({ nombre, rut }).subscribe({
        next: (res: any) => {
          console.log('✅ Login exitoso', res);
          localStorage.setItem('auth', 'true');
          localStorage.setItem('paciente', JSON.stringify(res.paciente));
          localStorage.setItem('userData', JSON.stringify(res)); //guarda la data para poder utilizarla dentro de las demas secciones luego del login
          this.router.navigateByUrl('/home');
        },
        error: (err) => {
          console.error('❌ Error en login:', err);
          alert('Paciente no encontrado o datos incorrectos');
        }
      });
    }
  }
}