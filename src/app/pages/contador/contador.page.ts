import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contador',
  templateUrl: './contador.page.html',
  styleUrls: ['./contador.page.scss'],
  standalone: false
})
export class ContadorPage implements OnInit {

  ordenes: any[] = [];

  constructor() {}

  ngOnInit() {
    this.cargarOrdenes();
  }

  cargarOrdenes() {
    this.ordenes = JSON.parse(localStorage.getItem('ordenes') || '[]');
  }


}
