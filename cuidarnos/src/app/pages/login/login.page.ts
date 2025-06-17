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

    this.loginForm.get('rut')?.valueChanges.subscribe(value => {
  const formateado = this.formatearRut(value);
  if (value !== formateado) {
    this.loginForm.get('rut')?.setValue(formateado, { emitEvent: false });
  }
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
    let { nombre, rut } = this.loginForm.value;

    let primerNombreRaw = nombre.trim().split(' ')[0];
    let primerNombre = primerNombreRaw.charAt(0).toUpperCase() + primerNombreRaw.slice(1).toLowerCase();
    rut = rut.replace(/\./g, '').toUpperCase();

    console.log('Enviando login con:', primerNombre, rut);

    // ✅ Borra todo lo viejo ANTES del login
    localStorage.clear();

    this.authService.login({ nombre: primerNombre, rut }).subscribe({
      next: (res: any) => {
        console.log('✅ Login exitoso', res);

        localStorage.setItem('auth', 'true');
        localStorage.setItem('userData', JSON.stringify(res));

        const tipo = res.tipo;

        if (tipo === 'paciente') {
          localStorage.setItem('paciente', JSON.stringify(res.paciente));
          this.router.navigateByUrl('/home');
        } else if (tipo === 'medico') {
          localStorage.setItem('medico', JSON.stringify(res.medico));
          this.router.navigateByUrl('/doctor-home');
        } else {
          alert('Tipo de usuario no reconocido');
        }
      },
      error: (err) => {
        console.error('❌ Error en login:', err);
        alert('Paciente no encontrado o datos incorrectos');
      }
    });
  }
}




  formatearRut(rut: string): string {
  if (!rut) return '';

  // Eliminar todo lo que no sea dígito o k/K
  rut = rut.replace(/[^\dkK]/g, '').toUpperCase();

  const cuerpo = rut.slice(0, -1);
  const dv = rut.slice(-1);

  let cuerpoFormateado = '';
  let contador = 0;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    cuerpoFormateado = cuerpo[i] + cuerpoFormateado;
    contador++;
    if (contador % 3 === 0 && i !== 0) {
      cuerpoFormateado = '.' + cuerpoFormateado;
    }
  }

  return cuerpoFormateado + '-' + dv;
}
}