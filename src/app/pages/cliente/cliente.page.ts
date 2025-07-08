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
  modalCarritoAbierto = false;
  carrito: any[] = [];
  totalCarrito = 0;
  userName: string = '';

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

    const storedName = localStorage.getItem('userName');
    if (storedName) {
      this.userName = storedName;
    }
  }


  irADetalle(id: string) {
  this.router.navigate(['/detalle-producto', id]);
  }

  mostrarCarrito() {
  // Carga el carrito desde localStorage
  this.carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

  // Calcula total
  this.totalCarrito = this.carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  // Abre el modal
  this.modalCarritoAbierto = true;
}

cerrarModal() {
  this.modalCarritoAbierto = false;
}

vaciarCarrito() {
  localStorage.removeItem('carrito');
  this.carrito = [];
  this.totalCarrito = 0;
}

cerrarSesion() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  this.router.navigate(['/home']); 
}

modalBolsaAbierta = false;
ordenes: any[] = [];
totalOrdenes = 0;

abrirBolsa() {
  (document.activeElement as HTMLElement)?.blur();

  setTimeout(() => {
    this.ordenes = JSON.parse(localStorage.getItem('ordenes') || '[]');
    this.totalOrdenes = this.ordenes.reduce((acc, o) => acc + o.precio * (o.cantidad || 1), 0);
    this.modalBolsaAbierta = true;
  }, 100);
}


cerrarBolsa() {
  this.modalBolsaAbierta = false;
}

vaciarOrdenes() {
  localStorage.removeItem('ordenes');
  this.ordenes = [];
  this.totalOrdenes = 0;
}

modalMonedaAbierto = false;
monedaSeleccionada = 'CLP';

abrirModalMoneda() {
  this.modalMonedaAbierto = true;
}

cerrarModalMoneda() {
  this.modalMonedaAbierto = false;
}

guardarMoneda() {
  console.log('Moneda seleccionada:', this.monedaSeleccionada);
  this.cerrarModalMoneda();
}



}
