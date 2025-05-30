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
    usuario.Email === this.email &&
    usuario.Contrasenia === this.password);


      if (usuarioValido) {
        alert('Inicio de sesión exitoso');
        this.router.navigate(['/cliente']); // o a donde quieras redirigir
      } else {
        alert('Email o contraseña incorrectos');
      }
    });

  }
}


