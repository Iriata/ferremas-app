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

  terminosAceptados: boolean = false;

  usuario = {
  rut: '',
  Nombre_completo: '',
  Email: '',
  Contrasenia: '',
  Region: '',
  Comuna: '',
  Direccion: ''
  };


  constructor(private usuarioService: UsuarioService) { }

  registrarUsuario() {
  this.usuarioService.getUsuarios().subscribe((usuarios: any[]) => {
    const rutExiste = usuarios.some(u => u.rut.toLowerCase() === this.usuario.rut.toLowerCase());
    const emailExiste = usuarios.some(u => u.Email.toLowerCase() === this.usuario.Email.toLowerCase());

    if (rutExiste) {
          alert('El RUT ya está registrado.');
          return;
        }

        if (emailExiste) {
          alert('El email ya está registrado.');
          return;
        }

        this.usuarioService.createUsuario(this.usuario).subscribe({
          next: () => {
            alert('Usuario registrado correctamente');
          },
          error: (err) => {
            console.error('Error al registrar usuario:', err);
          }
        });
      });
    }


  ngOnInit() {
    imports: [
    FormsModule,
    ]
  }

}
