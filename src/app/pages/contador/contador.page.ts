import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-contador',
  templateUrl: './contador.page.html',
  styleUrls: ['./contador.page.scss'],
  standalone: false
})
export class ContadorPage implements OnInit {

  usuarios: any[] = [];

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    const usuariosLocales = JSON.parse(localStorage.getItem('localUsers') || '[]');

    this.usuarioService.getUsuarios().subscribe((usuariosServidor: any[]) => {
      this.usuarios = [...usuariosServidor, ...usuariosLocales];
    }, () => {
      this.usuarios = [...usuariosLocales];
    });
  }

  actualizarAlgo(usuario: any) {
    console.log('Actualizar algo:', usuario);
  }

  actualizarTodo(usuario: any) {
    console.log('Actualizar todo:', usuario);
  }

  borrarUsuario(id: string) {
    this.usuarioService.deleteUsuarios(id).subscribe(() => {
      this.obtenerUsuarios();
    });
  }

}
