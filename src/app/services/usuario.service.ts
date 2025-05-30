import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url: string = "http://localhost:3000/Usuarios";

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<any[]> {
  return this.http.get<any[]>(this.url);
  }


  getUsuario(rut: string){}

  createUsuario(Usuarios: any){
    return this.http.post(this.url, Usuarios)
  }

  updateUsuarioscompleto(Usuarios: any){}

  updateUsuariosparcial(Usuarios: any){}

  deleteUsuarios(rut: string){}

}
