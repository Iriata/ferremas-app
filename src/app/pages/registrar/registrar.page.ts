import { Component, OnInit } from '@angular/core';
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

  validarEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  validarRut(rut: string): boolean {
    const re = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;
    return re.test(rut);
  }

  registrarUsuario() {
    if (!this.validarRut(this.usuario.rut)) {
      alert('Formato de RUT inválido. Ejemplo válido: 12345678-9');
      return;
    }

    if (!this.validarEmail(this.usuario.Email)) {
      alert('Formato de email inválido.');
      return;
    }

    this.usuarioService.getClientesApi().subscribe((usuarios: any[]) => {
      console.log('Clientes API:', usuarios); // Para verificar estructura

      const rutExiste = usuarios.some(u => u.rut?.toLowerCase() === this.usuario.rut.toLowerCase() || u.RUT?.toLowerCase() === this.usuario.rut.toLowerCase());
      const emailExiste = usuarios.some(u => u.Email?.toLowerCase() === this.usuario.Email.toLowerCase() || u.EMAIL?.toLowerCase() === this.usuario.Email.toLowerCase());

      if (rutExiste) {
        alert('El RUT ya está registrado.');
        return;
      }

      if (emailExiste) {
        alert('El email ya está registrado.');
        return;
      }

      this.usuarioService.createClienteFastApi(this.usuario).subscribe({
        next: () => {
          alert('Usuario registrado correctamente');
          // Limpiar formulario
          this.usuario = {
            rut: '',
            Nombre_completo: '',
            Email: '',
            Contrasenia: '',
            Region: '',
            Comuna: '',
            Direccion: ''
          };
          this.terminosAceptados = false;
        },
        error: (err) => {
          console.error('Error al registrar usuario:', err);
          alert('Error al registrar usuario. Revisa la consola para más detalles.');
        }
      });
    }, (error) => {
      console.error('Error al obtener clientes desde API:', error);
      alert('No se pudo obtener la lista de clientes para validación.');
    });
  }

  ngOnInit() { }
}
