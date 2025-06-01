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
    this.cargarOrdenes()
  }

  cargarOrdenes() {
  this.ordenes = JSON.parse(localStorage.getItem('ordenes') || '[]');
}

  rechazarPedido(index: number) {
  this.ordenes.splice(index, 1);
  localStorage.setItem('ordenes', JSON.stringify(this.ordenes));
}

prepararPedido(index: number) {
  this.ordenes[index].confirmado = true;
  localStorage.setItem('ordenes', JSON.stringify(this.ordenes));
}

}
