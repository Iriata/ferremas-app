import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


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
}
