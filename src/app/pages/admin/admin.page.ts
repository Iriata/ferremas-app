import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: false
})
export class AdminPage implements OnInit {

  usuarios: any[] = [];

  campoSeleccionado: string = 'Nombre_completo';
  nuevoValor: string = '';
  usuarioSeleccionado: any = null;

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    const usuariosLocales = JSON.parse(localStorage.getItem('localUsers') || '[]');

    this.usuarioService.getUsuarios().subscribe((usuariosServidor: any[]) => {
      this.usuarios = [...usuariosServidor, ...usuariosLocales];
    }, (error) => {
      console.error('Error al obtener usuarios del servidor:', error);
      this.usuarios = [...usuariosLocales];
    });
  }


  borrarUsuario(id: string) {
    this.usuarioService.deleteUsuarios(id).subscribe(() => {
      this.obtenerUsuarios();
    });
  }

  actualizarAlgo(usuario: any) {
    const datosParciales = {
      id: usuario.id,
      Email: 'nuevo@email.com' 
    };
    this.usuarioService.updateUsuariosparcial(datosParciales).subscribe(() => {
      this.obtenerUsuarios();
    });
  }

  actualizarTodo(usuario: any) {
    const datosCompletos = {
      id: usuario.id,
      rut: usuario.rut,
      Nombre_completo: 'Nombre Actualizado', 
      Email: usuario.Email,
      Contrasenia: usuario.Contrasenia,
      Region: usuario.Region,
      Comuna: usuario.Comuna,
      Direccion: usuario.Direccion
    };
    this.usuarioService.updateUsuarioscompleto(datosCompletos).subscribe(() => {
      this.obtenerUsuarios();
    });
  }
  usuarioEdit: any = {}; 

  abrirModal(usuario: any) {
   
    this.usuarioEdit = { ...usuario };
    const modal = new (window as any).bootstrap.Modal(document.getElementById('modalUsuario'));
    modal.show();
}
guardarCambios() {
  this.usuarioService.updateUsuarioscompleto(this.usuarioEdit).subscribe(() => {
    this.obtenerUsuarios();
    const modal = document.getElementById('modalUsuario');
    (window as any).bootstrap.Modal.getInstance(modal).hide();
  });
}


  modalActualizarAlgoAbierto = false;

  abrirModalActualizarAlgo(usuario: any) {
    this.usuarioEdit = { ...usuario };
    this.modalActualizarAlgoAbierto = true;

    // Por defecto: mostrar el nombre actual del usuario
    this.campoSeleccionado = 'Nombre_completo';
    this.nuevoValor = usuario.Nombre_completo;
  }

  cerrarModalActualizarAlgo() {
    this.modalActualizarAlgoAbierto = false;
    this.usuarioEdit = null;
    this.campoSeleccionado = 'Nombre_completo';
    this.nuevoValor = '';
  }

  aceptarActualizar() {
    if (!this.usuarioEdit || !this.campoSeleccionado || !this.nuevoValor) {
      return;
    }

    if (this.campoSeleccionado === 'Email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.nuevoValor)) {
        alert('El formato del correo es inválido.');
        return;
      }

      const emailDuplicado = this.usuarios.find(u => 
        u.Email === this.nuevoValor && u.id !== this.usuarioEdit.id
      );
      if (emailDuplicado) {
        alert(`El Email "${this.nuevoValor}" ya está en uso por otro usuario.`);
        return;
      }
    }

    const datosParciales: any = {
      id: this.usuarioEdit.id
    };

    datosParciales[this.campoSeleccionado] = this.nuevoValor;

    this.usuarioService.updateUsuariosparcial(datosParciales).subscribe(() => {
      this.obtenerUsuarios();
      this.cerrarModalActualizarAlgo();
    });
  }



  cambiarCampo() {
    this.nuevoValor = this.usuarioEdit ? this.usuarioEdit[this.campoSeleccionado] || '' : '';
  }


  modalActualizarTodoAbierto = false;

  abrirModalActualizarTodo(usuario: any) {
    this.usuarioEdit = { ...usuario };
    this.modalActualizarTodoAbierto = true;
  }

  cerrarModalActualizarTodo() {
    this.modalActualizarTodoAbierto = false;
    this.usuarioEdit = null;
  }

  aceptarActualizarTodo() {
    if (!this.usuarioEdit) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.usuarioEdit.Email)) {
      alert('Formato de email inválido');
      return;
    }

    const rutRegex = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;
    if (!rutRegex.test(this.usuarioEdit.rut)) {
      alert('Formato de RUT inválido');
      return;
    }

    const emailDuplicado = this.usuarios.some(u => u.Email === this.usuarioEdit.Email && u.id !== this.usuarioEdit.id);
    if (emailDuplicado) {
      alert('El email ya está en uso por otro usuario.');
      return;
    }

    const rutDuplicado = this.usuarios.some(u => u.rut === this.usuarioEdit.rut && u.id !== this.usuarioEdit.id);
    if (rutDuplicado) {
      alert('El RUT ya está en uso por otro usuario.');
      return;
    }

    this.usuarioService.updateUsuariosparcial(this.usuarioEdit).subscribe(() => {
      this.obtenerUsuarios();
      this.cerrarModalActualizarTodo();
    });
  }


}
