import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // API JSON-Server para usuarios locales
  private urlJsonServer: string = "http://localhost:3000/Usuarios";

  // API FastAPI para clientes reales
  private urlFastAPI: string = "http://localhost:8000";

  constructor(private http: HttpClient) { }

  // Métodos para JSON-Server
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.urlJsonServer);
  }

  getUsuario(rut: string) {
    return this.http.get<any>(`${this.urlJsonServer}/${rut}`);
  }

  createUsuario(usuario: any) {
    return this.http.post(this.urlJsonServer, usuario);
  }

  updateUsuarioscompleto(usuario: any): Observable<any> {
    return this.http.put<any>(`${this.urlJsonServer}/${usuario.id}`, usuario);
  }

  updateUsuariosparcial(usuario: any): Observable<any> {
    return this.http.patch<any>(`${this.urlJsonServer}/${usuario.id}`, usuario);
  }

  deleteUsuarios(rut: string): Observable<any> {
    return this.http.delete<any>(`${this.urlJsonServer}/${rut}`);
  }

  // ------------------------------
  // 🔗 Métodos para API FastAPI
  // ------------------------------

  // Login en FastAPI
  loginUsuario(data: { email: string, contrasenia: string }): Observable<any> {
    return this.http.post<any>(`${this.urlFastAPI}/login`, data);
  }

  // Obtener todos los clientes reales desde FastAPI
  getClientesApi(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlFastAPI}/clientes`);
  }

  // Crear un cliente real en FastAPI
  createClienteFastApi(cliente: any): Observable<any> {
    return this.http.post<any>(`${this.urlFastAPI}/clientes`, cliente);
  }

  // PUT: actualizar cliente completo por rut
  updateClienteFastApi(rut: string, cliente: any): Observable<any> {
    return this.http.put<any>(`${this.urlFastAPI}/clientes/${rut}`, cliente);
  }

  // PATCH: actualizar parcial por rut
  patchClienteFastApi(rut: string, cliente: any): Observable<any> {
    return this.http.patch<any>(`${this.urlFastAPI}/clientes/${rut}`, cliente);
  }

  // DELETE: eliminar cliente por rut
  deleteClienteFastApi(rut: string): Observable<any> {
    return this.http.delete<any>(`${this.urlFastAPI}/clientes/${rut}`);
  }
}
