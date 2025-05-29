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




}
