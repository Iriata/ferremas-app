import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  url: string = "http://localhost:3000/Productos";

  constructor(public http: HttpClient){}

  getProductos(){
    return this.http.get(this.url)
  }

  getProducto( Id_producto: string){}

  getProduc(Nombre_producto: string) {
  return this.http.get<any[]>(`${this.url}?Nombre_producto_like=${Nombre_producto}`);
  }

  getProducto2(Id_producto: string): Observable<any> {
  return this.http.get<any>(`${this.url}/${Id_producto}`);
  }


}
