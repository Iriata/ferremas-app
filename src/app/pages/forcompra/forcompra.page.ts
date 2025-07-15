import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { UsuarioService } from 'src/app/services/usuario.service';

declare var paypal: any;

@Component({
  selector: 'app-forcompra',
  templateUrl: './forcompra.page.html',
  styleUrls: ['./forcompra.page.scss'],
  standalone: false,
})
export class ForcompraPage implements OnInit {

  producto: any;
  carrito: any[] = [];
  totalCarrito: number = 0;

  metodoPago: string = '';
  metodoEntrega: string = '';
  fechaCompra: Date = new Date();

  usuario: any;
  usuarios: any[] = [];

  mostrarPaypal: boolean = false;

  monedaSeleccionada: string = 'CLP';  // Moneda por defecto
  tasaCambio: number = 1;             // Tasa de cambio para convertir a CLP

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    // Leer moneda y tasa de cambio guardada (desde página clientes)
    const monedaGuardada = localStorage.getItem('monedaSeleccionada');
    const tasaGuardada = localStorage.getItem('tasaCambio');

    if (monedaGuardada) this.monedaSeleccionada = monedaGuardada;
    if (tasaGuardada) this.tasaCambio = parseFloat(tasaGuardada);

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // Compra individual
      this.productoService.getProducto2(id).subscribe(async res => {
        this.producto = res;

        // Ajustar precio a moneda local para mostrar
        this.producto.precio_producto = this.producto.precio_producto / this.tasaCambio;

        this.totalCarrito = this.producto.precio_producto;

        try {
          await this.loadPayPalScript();
          this.renderPayPalButton();  
        } catch (error) {
          console.error(error);
        }
      });
    } else {
      // Compra desde el carrito
      const carritoGuardado = localStorage.getItem('carrito');
      this.carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];

      // Ajustar precios para mostrar con tasa cambio
      this.carrito.forEach(item => {
        item.precioMostrado = item.precio / this.tasaCambio;
      });

      this.totalCarrito = this.carrito.reduce(
        (acc, p) => acc + (p.precioMostrado * p.cantidad), 0
      );

      if (this.carrito.length > 0) {
        this.loadPayPalScript().then(() => {
          this.renderPayPalButton();
        }).catch(err => {
          console.error('Error cargando PayPal SDK:', err);
        });
      }
    }

    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);
    }
  }

  comprarProducto() {
    if (!this.producto) return;
    this.router.navigate(['/forcompra', this.producto.id]);
  }

  realizarOrden() {
    const ordenes = JSON.parse(localStorage.getItem('ordenes') || '[]');
    let disponibilidad = 'en espera'; 

    if (this.metodoEntrega === 'Retiro en tienda' || this.metodoEntrega === '1') {
      disponibilidad = 'en tienda'; 
    } else if (this.metodoEntrega === 'Despacho a domicilio' || this.metodoEntrega === '2') {
      disponibilidad = 'en camino'; 
    }

    const user = localStorage.getItem('userName') || 'Invitado';

    if (this.producto) {
      // Orden individual
      const orden = {
        productoId: this.producto.id_producto,
        nombreProducto: this.producto.nombre_producto,
        precio: this.producto.precio_producto * this.tasaCambio,  // Guardar precio original en CLP
        usuario: user,
        metodoPago: this.metodoPago,
        metodoEntrega: this.metodoEntrega,
        fecha: this.fechaCompra.toISOString(),
        estado: 'en espera',
        disponibilidad: disponibilidad
      };

      ordenes.push(orden);

    } else {
      // Orden desde carrito
      this.carrito.forEach(item => {
        const orden = {
          productoId: item.id,
          nombreProducto: item.nombre,
          precio: item.precio, // precio ya en CLP en carrito
          usuario: user,
          metodoPago: this.metodoPago,
          metodoEntrega: this.metodoEntrega,
          fecha: this.fechaCompra.toISOString(),
          estado: 'en espera',
          disponibilidad: disponibilidad
        };

        ordenes.push(orden);
      });

      localStorage.removeItem('carrito');
    }

    localStorage.setItem('ordenes', JSON.stringify(ordenes));
    alert('Orden realizada correctamente');
  }

  renderPayPalButton() {
    const paypalContainer = document.getElementById('paypal-button-container');
    if (!paypalContainer) return;

    paypalContainer.innerHTML = '';

    // Determinar total y descripción para compra individual o múltiple
    let totalUSD = 0;
    let descripcion = '';

    if (this.producto) {
      // Convertir precio mostrado (en moneda local) a USD para PayPal
      totalUSD = this.convertirAPrecioUSD(this.producto.precio_producto);
      descripcion = this.producto.nombre_producto;
    } else if (this.carrito.length > 0) {
      // Sumar los precios en moneda local, convertir a USD para PayPal
      const totalLocal = this.carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
      totalUSD = this.convertirAPrecioUSD(totalLocal);
      descripcion = this.carrito.map(p => `${p.cantidad} x ${p.nombre}`).join(', ');
    } else {
      // No hay productos
      return;
    }

    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              currency_code: 'USD',
              value: totalUSD.toFixed(2)
            },
            description: descripcion
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          const metodo = details.payer?.funding_source === 'BANK'
            ? 'Transferencia'
            : 'PayPal (Tarjeta)';
          this.metodoPago = metodo;
          localStorage.setItem('metodoPago', metodo);

          alert(`Pago realizado por ${details.payer.name.given_name}`);
          this.realizarOrden();
        });
      },
      onError: (err: any) => {
        console.error('Error en el pago:', err);
        alert('Hubo un problema al procesar el pago');
      }
    }).render('#paypal-button-container');
  }

  loadPayPalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).paypal) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=AZlf2tykhAeaCXfASRhwpOz6gy_-SxsR81ZVJ3AtOFqHNk0xmGisONtJFzJY7HgkavgsNzGkWrU5LeS6&currency=USD';
      script.onload = () => resolve();
      script.onerror = () => reject('PayPal SDK no se pudo cargar');
      document.body.appendChild(script);
    });
  }

  convertirAPrecioUSD(precioMonedaLocal: number): number {
    // Convierte precio local (CLP o la moneda mostrada) a USD para PayPal
    const valorDolar = 930; // Podrías hacerlo dinámico consultando una API o servicio
    const precioCLP = precioMonedaLocal * this.tasaCambio;  // convertir a CLP
    return +(precioCLP / valorDolar).toFixed(2);
  }

  onMetodoEntregaChange() {
    if (this.metodoEntrega && (this.producto || this.carrito.length > 0)) {
      this.mostrarPaypal = true;
      setTimeout(() => {
        this.renderPayPalButton(); 
      }, 100);
    } else {
      this.mostrarPaypal = false;
    }
  }
}
