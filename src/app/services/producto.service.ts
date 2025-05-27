import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  url: string = "http://localhost:3000/Productos";

  constructor(public http: HttpClient){}

  getProductos(){
    try {
      return this.http.get(this.url)
    } catch (error) {
      console.log("Error :" + error)
      return {error: "error de consumo"}
    }
  }

  getProducto( Id_producto: string){}
}
