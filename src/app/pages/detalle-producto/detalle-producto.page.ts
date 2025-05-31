import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
  standalone: false,
})
export class DetalleProductoPage implements OnInit {

  producto: any;

  constructor(private route: ActivatedRoute, private productoService: ProductoService) { }

  ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id');
  console.log('ID recibido:', id); // debería ser "0001"

  if (id) {
    this.productoService.getProducto2(id).subscribe({
      next: (res: any) => {
        console.log('Producto recibido:', res); // deberías ver el objeto completo
        this.producto = res;
      },
      error: (err) => {
        console.error('Error al obtener el producto', err);
      }
    });
  }
}

agregarAlCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

    const productoExistente = carrito.find((p: any) => p.id === this.producto.id,);

    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      carrito.push({
        id: this.producto.id,
        nombre: this.producto.Nombre_producto,
        precio: this.producto.Precio_producto,
        imagen: this.producto.Ruta_imagen_producto,
        cantidad: 1
      });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    console.log('Producto agregado al carrito:', this.producto.Nombre_producto);
  }


}
