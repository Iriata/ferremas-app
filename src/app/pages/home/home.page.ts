import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  
  email: string = '';
  password: string = '';

  constructor(private usuarioService: UsuarioService,
    private router: Router) {}

    login() {
    this.usuarioService.getUsuarios().subscribe((usuarios: any[]) => {
    const usuarioValido = usuarios.find(usuario =>
      usuario.Email.toLowerCase().trim() === this.email.toLowerCase().trim() &&
      usuario.Contrasenia === this.password
    );



      if (usuarioValido) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', usuarioValido.Email);
        const primerNombre = usuarioValido.Nombre_completo.split(' ')[0];
        localStorage.setItem('userName', primerNombre);
        this.router.navigate(['/cliente']);
      } else {
        alert('Email o contraseña incorrectos');
      }
    });

  }
}


