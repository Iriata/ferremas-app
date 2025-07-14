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
  metodoPago: string = '';
  metodoEntrega: string = '';
  fechaCompra: Date = new Date();
  usuario: any;
  usuarios: any[] = [];
  mostrarPaypal: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private usuarioService: UsuarioService
  ) { }

ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.productoService.getProducto2(id).subscribe(async res => {
      this.producto = res;
      try {
        await this.loadPayPalScript();
        this.renderPayPalButton();  
      } catch (error) {
        console.error(error);
      }
    });
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
  if (!this.producto) return alert('No hay producto seleccionado');

  let disponibilidad = 'en espera'; 

  if (this.metodoEntrega === '1') {
    disponibilidad = 'en tienda'; 
  } else if (this.metodoEntrega === '2') {
    disponibilidad = 'en camino'; 
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

renderPayPalButton() {
  if (!this.producto) return;

  const paypalContainer = document.getElementById('paypal-button-container');
  if (paypalContainer) {
    // Limpia el contenido anterior
    paypalContainer.innerHTML = '';
  }

  // Renderiza los botones de nuevo
  paypal.Buttons({
    createOrder: (data: any, actions: any) => {
      return actions.order.create({
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: this.producto.Precio_producto.toString()
          },
          description: this.producto.Nombre_producto
        }]
      });
    },
    onApprove: (data: any, actions: any) => {
      return actions.order.capture().then((details: any) => {
        const metodo = details.payer && details.payer.funding_source === 'BANK'
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

convertirAPrecioUSD(precioCLP: number): number {
  const valorDolar = 930; // 👈 cámbialo por el valor real que obtengas de la API
  return +(precioCLP / valorDolar).toFixed(2); // máximo dos decimales
}

onMetodoEntregaChange() {
  if (this.metodoEntrega) {
    this.mostrarPaypal = true;
    setTimeout(() => {
      this.renderPayPalButton(); 
    });
  } else {
    this.mostrarPaypal = false;
  }
}

}
