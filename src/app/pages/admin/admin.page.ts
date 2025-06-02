import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone:false
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


  actualizarUsuario(usuario: any) {
    console.log('Actualizar usuario:', usuario);
  }
}
