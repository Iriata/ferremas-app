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
  metodoPago: string = '1';  // valores iniciales según options
  metodoEntrega: string = '1';
  fechaCompra: Date = new Date();
  

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productoService: ProductoService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');  // solo aquí obtienes el id de la ruta
    if (id) {
      this.productoService.getProducto2(id).subscribe(res => {
        this.producto = res;
      });
    }
  }

  // Si no usas esta función, puedes borrarla
  comprarProducto() {
    if (!this.producto) return;
    this.router.navigate(['/forcompra', this.producto.id]); // pasar id directo como parámetro
  }

  realizarOrden() {
    if (!this.producto) return alert('No hay producto seleccionado');

    const orden = {
      productoId: this.producto.id,  // usa "id"
      nombreProducto: this.producto.Nombre_producto,
      precio: this.producto.Precio_producto,
      usuario: localStorage.getItem('userName') || 'Invitado',
      metodoPago: this.metodoPago,
      metodoEntrega: this.metodoEntrega,
      fecha: this.fechaCompra.toISOString(),
      confirmado: false
    };

    console.log('Orden:', orden);

    const ordenes = JSON.parse(localStorage.getItem('ordenes') || '[]');
    ordenes.push(orden);
    localStorage.setItem('ordenes', JSON.stringify(ordenes));

    // Guardar orden en backend o localStorage
    alert('Orden realizada correctamente');
  }
}
