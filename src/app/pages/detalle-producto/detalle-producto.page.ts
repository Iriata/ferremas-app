import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
  standalone: false,
})
export class DetalleProductoPage implements OnInit {

  producto: any;

  precioConvertido: number = 0;
  monedaSeleccionada: string = 'CLP';
  simboloMoneda: string = '$';
  tasaCambio: number = 1;

  constructor(
    private route: ActivatedRoute, 
    private productoService: ProductoService,
    private router: Router
  ) { }

  getSimboloMoneda(codigo: string): string {
    const mapSimbolos: any = {
      'CLP': '$',
      'USD': 'USD $',
      'EUR': '€',
    };
    return mapSimbolos[codigo] || codigo;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.monedaSeleccionada = localStorage.getItem('monedaSeleccionada') || 'CLP';
    this.tasaCambio = Number(localStorage.getItem('tasaCambio')) || 1;
    this.simboloMoneda = this.getSimboloMoneda(this.monedaSeleccionada);

    if (id) {
      this.productoService.getProducto2(id).subscribe({
        next: (res: any) => {
          this.producto = res;

          this.precioConvertido = +(this.producto.precio_producto / this.tasaCambio).toFixed(2);
        },
        error: (err) => {
          console.error('Error al obtener el producto', err);
        }
      });
    }
  }

  agregarAlCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

    const precioEnMoneda = this.precioConvertido;

    const productoExistente = carrito.find((p: any) => p.id === this.producto.id_producto);

    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      carrito.push({
        id: this.producto.id_producto,
        nombre: this.producto.nombre_producto,
        precio: precioEnMoneda,
        imagen: this.producto.ruta_imagen_producto,
        cantidad: 1
      });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    console.log('Producto agregado al carrito:', this.producto.nombre_producto);

    this.router.navigate(['/cliente'], { queryParams: { carritoAbierto: 'true' } });
  }

  irAForCompra() {
    this.router.navigate(['/forcompra', this.producto.id_producto]);
  }
}
