import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  // Asegúrate de que coincida exactamente con tu ruta de Express (sensible a mayúsculas/minúsculas)
  url: string = 'http://localhost:3000/productos';

  constructor(public http: HttpClient) {}

  // ✅ GET: Todos los productos
  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  // ✅ GET: Búsqueda por nombre (usa query param)
  getProduc(Nombre_producto: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}?Nombre_producto_like=${Nombre_producto}`);
  }

  // ✅ GET: Producto por ID
  getProducto2(Id_producto: string): Observable<any> {
    return this.http.get<any>(`${this.url}/${Id_producto}`);
  }
}

