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

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.usuarioService.getUsuarios().subscribe((data) => {
      this.usuarios = data;
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
}
