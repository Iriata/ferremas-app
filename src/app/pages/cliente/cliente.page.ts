import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { MonedaService } from '../../services/moneda.service';

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
  
  monedaSeleccionada = 'CLP';
  tasaCambio = 1; 

  modalMonedaAbierto: boolean = false;

  abrirModalMoneda() {
    this.modalMonedaAbierto = true;
  }

  cerrarModalMoneda() {
    this.modalMonedaAbierto = false;
  }

  constructor(
    private productoService: ProductoService, 
    private router: Router,
    private alertController: AlertController,
    private monedaService: MonedaService) 
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
  this.carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
  this.totalCarrito = this.carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
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

guardarMoneda() {
  this.monedaService.obtenerIndicadores().subscribe({
    next: (data: any) => {
      console.log('Datos recibidos:', data);
      if (this.monedaSeleccionada === 'USD') {
        this.tasaCambio = data.dolar?.valor || 1;
      } else if (this.monedaSeleccionada === 'EUR') {
        this.tasaCambio = data.euro?.valor || 1;
      } else {
        this.tasaCambio = 1;
      }

      console.log('Tasa de cambio aplicada:', this.tasaCambio);
      this.cerrarModalMoneda();
    },
    error: (err) => {
      console.error('Error al obtener indicadores', err);
    }
  });
}


  formatearPrecio(precio: number): string {
  const precioConvertido = precio / this.tasaCambio;
  if (this.monedaSeleccionada === 'CLP') {
    return precioConvertido.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  } else {
    return precioConvertido.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}


}
