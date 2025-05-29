import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
  standalone: false,
})
export class ClientePage implements OnInit {

  productos: any[] = [];
  busqueda: string = '';
  alertButtons = ['Action'];

  constructor(
    private productoService: ProductoService, 
    private router: Router,
    private alertController: AlertController) 
    { }

  ngOnInit() {
    this.productoService.getProductos().subscribe({
      next: (res: any) => {
        this.productos = res;
        console.log(this.productos);
      },
      error: (err) => {
        console.error("Error al obtener productos", err);
      }
    });
  }

  //async irADetalle(producto: any) {
  //  const alert = await this.alertController.create({
  //    header: producto.Nombre_producto,
  //    message: `Descripción: ${producto.Descripcion_producto}\n\nPrecio: ${producto.Precio_producto}`,
  //    buttons: ['Comprar','Agregar al carrito']
  //  });

  //  await alert.present();
  //}

  irADetalle(id: string) {
  this.router.navigate(['/detalle-producto', id]);
  }



}
