import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vendedor',
  templateUrl: './vendedor.page.html',
  styleUrls: ['./vendedor.page.scss'],
  standalone: false,
})
export class VendedorPage implements OnInit {

  ordenes: any[] = [];

  constructor() { }

  ngOnInit() {
    this.cargarOrdenes();
  }

  cargarOrdenes() {
    const todasLasOrdenes = JSON.parse(localStorage.getItem('ordenes') || '[]');
    this.ordenes = todasLasOrdenes.filter((orden: any) => 
      orden.estado !== 'rechazado' && orden.estado !== 'en espera'
    );
  }

  marcarEntregado(index: number) {
    this.ordenes[index].disponibilidad = 'entregado';
    localStorage.setItem('ordenes', JSON.stringify(this.ordenes));
  }
}

