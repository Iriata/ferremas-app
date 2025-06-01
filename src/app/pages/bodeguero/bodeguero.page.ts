import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bodeguero',
  templateUrl: './bodeguero.page.html',
  styleUrls: ['./bodeguero.page.scss'],
  standalone: false,
})
export class BodegueroPage implements OnInit {

  ordenes: any[] = [];

  constructor() { }

  ngOnInit() {
    this.cargarOrdenes();
  }

  cargarOrdenes() {
    this.ordenes = JSON.parse(localStorage.getItem('ordenes') || '[]');
  }

  rechazarPedido(index: number) {
    this.ordenes[index].estado = 'rechazado';
    this.ordenes[index].disponibilidad = 'no disponible';
    this.guardarOrdenes();
  }

  prepararPedido(index: number) {
    this.ordenes[index].estado = 'aceptado';
    this.guardarOrdenes();
  }

  guardarOrdenes() {
    localStorage.setItem('ordenes', JSON.stringify(this.ordenes));
  }
}
