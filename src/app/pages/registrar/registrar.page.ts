import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
  standalone: false,
})
export class RegistrarPage implements OnInit {

  usuario = {
  Rut: '',
  Nombre_completo: '',
  Email: '',
  Contrasena: '',
  Region: '',
  Comuna: '',
  Direccion: ''
  };


  constructor(private usuarioService: UsuarioService) { }

  registrarUsuario() {
  this.usuarioService.createUsuario(this.usuario).subscribe({
    next: () => {
      alert('Usuario registrado correctamente');
    },
    error: (err) => {
      console.error('Error al registrar usuario:', err);
    }
  });
  }

  ngOnInit() {
    imports: [
    FormsModule,
    ]
  }

}
