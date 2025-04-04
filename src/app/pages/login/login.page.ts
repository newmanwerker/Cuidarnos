import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email } = this.loginForm.value;

      // Cualquiera de estas credenciales lleva al home, asi no tenemos que estar usando nuevos a cada rato, luego esto lo debemos manejar y extraer con BE desde la DB
      if (email === 'seba@g.com') {
        localStorage.setItem('auth', 'true');
        this.router.navigateByUrl('/home');
      } else if (email === 'fer@g.com') {
        localStorage.setItem('auth', 'fake');
        this.router.navigateByUrl('/home');
      } else {
        alert('Credenciales incorrectas');
      }
    }
  }
}