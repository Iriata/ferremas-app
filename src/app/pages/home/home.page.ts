import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  email: string = '';
  password: string = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit() {
    // Carga los usuarios locales si no existen
    const yaExisten = localStorage.getItem('localUsers');
    if (!yaExisten) {
      const usuariosLocales = [
        {
          rut: "11111111-1",
          Nombre_completo: "Admin Usuario",
          Email: "admin@email.com",
          Contrasenia: "admin123",
          Region: "Región X",
          Comuna: "Comuna X",
          Direccion: "Calle Falsa 123",
          Tipo_usuario: "admin"
        },
        {
          rut: "22222222-2",
          Nombre_completo: "Bodeguero Usuario",
          Email: "bodeguero@email.com",
          Contrasenia: "bodega123",
          Region: "Región X",
          Comuna: "Comuna X",
          Direccion: "Calle Falsa 456",
          Tipo_usuario: "bodeguero"
        },
        {
          rut: "33333333-3",
          Nombre_completo: "Vendedor Usuario",
          Email: "vendedor@email.com",
          Contrasenia: "vende123",
          Region: "Región X",
          Comuna: "Comuna X",
          Direccion: "Calle Falsa 789",
          Tipo_usuario: "vendedor"
        },
        {
          rut: "44444444-4",
          Nombre_completo: "Contador Usuario",
          Email: "contador@email.com",
          Contrasenia: "cuentas123",
          Region: "Región X",
          Comuna: "Comuna X",
          Direccion: "Calle Falsa 321",
          Tipo_usuario: "contador"
        }
      ];
      localStorage.setItem('localUsers', JSON.stringify(usuariosLocales));
    }
  }

  login() {
    this.usuarioService.getUsuarios().subscribe((usuariosServidor: any[]) => {
      const usuariosLocales = JSON.parse(localStorage.getItem('localUsers') || '[]');
      const todosLosUsuarios = [...usuariosServidor, ...usuariosLocales];

      const usuarioValido = todosLosUsuarios.find(usuario =>
        usuario.Email.toLowerCase().trim() === this.email.toLowerCase().trim() &&
        usuario.Contrasenia === this.password
      );

      if (usuarioValido) {
        this.guardarLogin(usuarioValido);
      } else {
        alert('Email o contraseña incorrectos');
      }
    });
  }

  guardarLogin(usuario: any) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', usuario.Email);
    const primerNombre = usuario.Nombre_completo.split(' ')[0];
    localStorage.setItem('userName', primerNombre);

    const tipo = usuario.Tipo_usuario?.toLowerCase() || '';

    if (tipo === 'admin') {
      this.router.navigate(['/admin']);
    } else if (tipo === 'bodeguero') {
      this.router.navigate(['/bodeguero']);
    } else if (tipo === 'vendedor') {
      this.router.navigate(['/vendedor']);
    } else if (tipo === 'contador') {
      this.router.navigate(['/contador']);
    } else {
      this.router.navigate(['/cliente']);
    }
  }
}
