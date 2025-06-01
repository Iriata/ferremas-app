import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-forcompra',
  templateUrl: './forcompra.page.html',
  styleUrls: ['./forcompra.page.scss'],
  standalone: false,
})
export class ForcompraPage implements OnInit {

  producto: any;
  metodoPago: string = '1';  
  metodoEntrega: string = '1';
  fechaCompra: Date = new Date();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productoService: ProductoService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productoService.getProducto2(id).subscribe(res => {
        this.producto = res;
      });
    }
  }

  comprarProducto() {
    if (!this.producto) return;
    this.router.navigate(['/forcompra', this.producto.id]);
  }

  realizarOrden() {
  if (!this.producto) return alert('No hay producto seleccionado');

  // Determinar disponibilidad según método de entrega
  let disponibilidad = 'en espera'; // Valor por defecto

  if (this.metodoEntrega === '1') {
    disponibilidad = 'en tienda';  // Retiro en tienda
  } else if (this.metodoEntrega === '2') {
    disponibilidad = 'en camino';  // Despacho a domicilio
  }

  const orden = {
    productoId: this.producto.id,
    nombreProducto: this.producto.Nombre_producto,
    precio: this.producto.Precio_producto,
    usuario: localStorage.getItem('userName') || 'Invitado',
    metodoPago: this.metodoPago,
    metodoEntrega: this.metodoEntrega,
    fecha: this.fechaCompra.toISOString(),
    estado: 'en espera',
    disponibilidad: disponibilidad
  };

  console.log('Orden:', orden);

  const ordenes = JSON.parse(localStorage.getItem('ordenes') || '[]');
  ordenes.push(orden);
  localStorage.setItem('ordenes', JSON.stringify(ordenes));

  alert('Orden realizada correctamente');
}

}
